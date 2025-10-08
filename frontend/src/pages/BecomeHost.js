import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaMapMarkerAlt, FaDollarSign, FaBed, FaBath, FaRulerCombined, FaImage, FaCheckCircle } from 'react-icons/fa';
import { useToast } from '../components/Toast';
import { useUser } from '../components/UserContext';

const BecomeHost = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [shareToComm, setShareToComm] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageLgPreview, setImageLgPreview] = useState(null);
  const [uploadMethod, setUploadMethod] = useState('url'); // 'url' or 'file'
  const [formData, setFormData] = useState({
    name: '',
    type: 'Apartment',
    country: 'Vietnam',
    address: '',
    bedrooms: 1,
    bathrooms: 1,
    surface: '',
    price: '',
    description: '',
    image: '',
    imageLg: '',
    amenities: [],
  });

  const amenitiesList = [
    'WiFi', 'Điều hòa', 'Bếp', 'Máy giặt', 'TV', 'Bãi đỗ xe',
    'Hồ bơi', 'Gym', 'Ban công', 'Thang máy', 'An ninh 24/7', 'Sân vườn'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chọn file ảnh!');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước ảnh không được vượt quá 5MB!');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData(prev => ({ ...prev, [fieldName]: base64String }));
        
        if (fieldName === 'image') {
          setImagePreview(base64String);
        } else if (fieldName === 'imageLg') {
          setImageLgPreview(base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = (fieldName) => {
    setFormData(prev => ({ ...prev, [fieldName]: '' }));
    if (fieldName === 'image') {
      setImagePreview(null);
    } else if (fieldName === 'imageLg') {
      setImageLgPreview(null);
    }
  };

  const toggleAmenity = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Vui lòng đăng nhập để đăng nhà!');
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/houses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          status: 'pending', // Chờ admin duyệt
          agent: {
            name: user.username || user.email,
            phone: user.phone || '+84 123 456 789',
            image: user.avatar || 'https://i.pravatar.cc/150?img=1'
          }
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Đăng nhà thất bại');
      }

      // Tạo post trong Community nếu user chọn
      if (shareToComm) {
        // Generate avatar
        const getUserAvatar = () => {
          if (user?.profilePicture) return user.profilePicture;
          if (user?.avatar) return user.avatar;
          if (user?.username) {
            return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=7c3aed&color=fff&size=150&bold=true`;
          }
          if (user?.email) {
            const name = user.email.split('@')[0];
            return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7c3aed&color=fff&size=150&bold=true`;
          }
          return 'https://ui-avatars.com/api/?name=User&background=7c3aed&color=fff&size=150&bold=true';
        };

        const communityPost = {
          author: {
            name: user.username || user.email,
            avatar: getUserAvatar(),
            role: 'Chủ nhà',
            isHost: true
          },
          content: `🏠 Vừa đăng nhà mới cho thuê!\n\n${formData.name}\n📍 ${formData.address}\n💰 $${formData.price}/tháng\n\n${formData.description}`,
          images: [formData.image],
          houseData: data, // Lưu data nhà để link
          timestamp: 'Vừa xong'
        };
        
        // Lưu vào localStorage để Community đọc
        const existingPosts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
        localStorage.setItem('communityPosts', JSON.stringify([communityPost, ...existingPosts]));
      }

      toast.success(shareToComm 
        ? '🎉 Đăng nhà thành công và đã chia sẻ lên cộng đồng!' 
        : '🎉 Đăng nhà thành công! Nhà của bạn đang chờ duyệt.'
      );
      
      setTimeout(() => {
        navigate(shareToComm ? '/community' : '/');
      }, 2000);

    } catch (err) {
      toast.error(err.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && (!formData.name || !formData.address)) {
      toast.warning('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    if (step === 2 && (!formData.price || !formData.surface)) {
      toast.warning('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-block mb-4">
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
              ✨ Bắt đầu hành trình
            </div>
          </div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Trở thành chủ nhà 🏠
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Chia sẻ không gian của bạn và kiếm thêm thu nhập
          </p>
        </motion.div>

        {/* Progress Bar - Enhanced */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-10 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          {/* Steps with Progress Line */}
          <div className="mb-6">
            <div className="flex items-center justify-center">
              {[1, 2, 3].map((s, index) => (
                <React.Fragment key={s}>
                  <div className="flex flex-col items-center">
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className={`relative w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 z-10 ${
                        step >= s 
                          ? 'bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-violet-500/50' 
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                      }`}
                    >
                      {step > s ? (
                        <FaCheckCircle className="text-xl" />
                      ) : (
                        <span className="font-extrabold">{s}</span>
                      )}
                      {step === s && (
                        <motion.div
                          className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-600 to-purple-600"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          style={{ opacity: 0.3 }}
                        />
                      )}
                    </motion.div>
                  </div>
                  
                  {/* Connecting Line */}
                  {s < 3 && (
                    <div className="flex-1 mx-4 h-1 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 relative" style={{ maxWidth: '200px' }}>
                      <motion.div 
                        className="h-full bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600"
                        initial={{ width: 0 }}
                        animate={{ width: step > s ? '100%' : '0%' }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Labels */}
          <div className="flex justify-between text-center">
            {[
              { icon: <FaHome className="inline mb-1" />, text: 'Thông tin cơ bản' },
              { icon: <FaDollarSign className="inline mb-1" />, text: 'Chi tiết & Giá' },
              { icon: <FaImage className="inline mb-1" />, text: 'Hình ảnh & Mô tả' }
            ].map((item, index) => (
              <div 
                key={index}
                className={`flex flex-col items-center transition-all duration-300`}
                style={{ width: '33.33%' }}
              >
                <div className={`text-lg mb-1 ${
                  step >= index + 1
                    ? 'text-violet-600 dark:text-violet-400'
                    : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {item.icon}
                </div>
                <span className={`text-xs font-medium ${
                  step >= index + 1
                    ? 'text-violet-600 dark:text-violet-400'
                    : 'text-gray-500 dark:text-gray-500'
                }`}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
        >
          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Thông tin cơ bản
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FaHome className="inline mr-2" />
                    Tên nhà
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="VD: Căn hộ cao cấp view biển"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Loại nhà
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="Apartment">Apartment</option>
                      <option value="House">House</option>
                      <option value="Villa">Villa</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Quốc gia
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="Vietnam">Vietnam</option>
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FaMapMarkerAlt className="inline mr-2" />
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="VD: 123 Nguyễn Huệ, Quận 1, TP.HCM"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 2: Details & Price */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Chi tiết & Giá cả
                </h2>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FaBed className="inline mr-2" />
                      Phòng ngủ
                    </label>
                    <input
                      type="number"
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleChange}
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FaBath className="inline mr-2" />
                      Phòng tắm
                    </label>
                    <input
                      type="number"
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleChange}
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FaRulerCombined className="inline mr-2" />
                      Diện tích (m²)
                    </label>
                    <input
                      type="number"
                      name="surface"
                      value={formData.surface}
                      onChange={handleChange}
                      placeholder="100"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FaDollarSign className="inline mr-2" />
                    Giá thuê ($/tháng)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="1000"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Tiện nghi
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {amenitiesList.map((amenity) => (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className={`px-4 py-2 rounded-xl border-2 transition ${
                          formData.amenities.includes(amenity)
                            ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400'
                            : 'border-gray-200 dark:border-gray-700 hover:border-violet-300 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {amenity}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Images & Description */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Hình ảnh & Mô tả
                </h2>

                {/* Upload Method Toggle */}
                <div className="flex gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => setUploadMethod('file')}
                    className={`flex-1 px-4 py-3 rounded-xl font-medium transition ${
                      uploadMethod === 'file'
                        ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    📁 Upload từ máy tính
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMethod('url')}
                    className={`flex-1 px-4 py-3 rounded-xl font-medium transition ${
                      uploadMethod === 'url'
                        ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    🔗 Nhập URL
                  </button>
                </div>

                {/* Main Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FaImage className="inline mr-2" />
                    Hình ảnh chính *
                  </label>
                  
                  {uploadMethod === 'file' ? (
                    <div className="space-y-3">
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'image')}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-violet-500 dark:hover:border-violet-500 transition bg-gray-50 dark:bg-gray-700/50"
                        >
                          <FaImage className="text-4xl text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Click để chọn ảnh từ máy tính
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            (Tối đa 5MB, định dạng: JPG, PNG, GIF)
                          </p>
                        </label>
                      </div>
                      
                      {imagePreview && (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-64 object-cover rounded-xl"
                          />
                          <button
                            type="button"
                            onClick={() => clearImage('image')}
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition shadow-lg"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  )}
                </div>

                {/* Large Image (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hình ảnh lớn (tùy chọn)
                  </label>
                  
                  {uploadMethod === 'file' ? (
                    <div className="space-y-3">
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'imageLg')}
                          className="hidden"
                          id="imageLg-upload"
                        />
                        <label
                          htmlFor="imageLg-upload"
                          className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-violet-500 dark:hover:border-violet-500 transition bg-gray-50 dark:bg-gray-700/50"
                        >
                          <FaImage className="text-3xl text-gray-400 mb-1" />
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Click để chọn ảnh lớn (optional)
                          </p>
                        </label>
                      </div>
                      
                      {imageLgPreview && (
                        <div className="relative">
                          <img
                            src={imageLgPreview}
                            alt="Preview Large"
                            className="w-full h-48 object-cover rounded-xl"
                          />
                          <button
                            type="button"
                            onClick={() => clearImage('imageLg')}
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition shadow-lg"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <input
                      type="url"
                      name="imageLg"
                      value={formData.imageLg}
                      onChange={handleChange}
                      placeholder="https://example.com/image-large.jpg"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="6"
                    placeholder="Mô tả chi tiết về nhà của bạn..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                {/* Preview for URL method */}
                {uploadMethod === 'url' && formData.image && (
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preview:</p>
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL';
                      }}
                    />
                  </div>
                )}

                {/* Share to Community */}
                <div className="bg-violet-50 dark:bg-violet-900/20 rounded-xl p-4 border-2 border-violet-200 dark:border-violet-800">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shareToComm}
                      onChange={(e) => setShareToComm(e.target.checked)}
                      className="w-5 h-5 text-violet-600 rounded focus:ring-2 focus:ring-violet-500"
                    />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        🌐 Chia sẻ lên Cộng đồng
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Tự động đăng bài giới thiệu nhà của bạn lên trang Cộng đồng để tiếp cận nhiều người hơn
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 rounded-xl transition"
                >
                  Quay lại
                </button>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition shadow-lg"
                >
                  Tiếp tục
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Đang đăng...' : '🎉 Đăng nhà'}
                </button>
              )}
            </div>
          </form>
        </motion.div>

        {/* Info Cards */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🏠</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Miễn phí đăng tin</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">💰</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Kiếm thêm thu nhập</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🔒</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">An toàn & bảo mật</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeHost;
