import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaCalendar, FaMapMarkerAlt, FaCamera, FaCheckCircle } from 'react-icons/fa';
import { ImSpinner2 } from 'react-icons/im';
import { useUser } from '../components/UserContext';

const Profile = () => {
  const navigate = useNavigate();
  const { updateProfile: updateUserContext } = useUser();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    address: '',
    dateOfBirth: '',
    profilePicture: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }

    const userData = JSON.parse(userStr);
    
    // Ensure _id exists
    if (!userData._id && !userData.id) {
      setMessage('Lỗi: Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.');
      return;
    }
    
    setUser(userData);
    setFormData({
      username: userData.username || '',
      email: userData.email || '',
      address: userData.address || '',
      dateOfBirth: userData.dateOfBirth || '',
      profilePicture: userData.profilePicture || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB before compression)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('Ảnh quá lớn! Vui lòng chọn ảnh nhỏ hơn 5MB.');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage('Vui lòng chọn file ảnh!');
        return;
      }

      setMessage('Đang xử lý ảnh...');
      
      try {
        // Compress and optimize image
        const optimizedImage = await compressImage(file, {
          maxWidth: 800,
          maxHeight: 800,
          quality: 0.8
        });

        if (process.env.NODE_ENV === 'development') {
          console.log('Image optimized:', {
            original: (file.size / 1024).toFixed(2) + ' KB',
            compressed: (optimizedImage.length / 1024).toFixed(2) + ' KB',
            reduction: (((file.size - optimizedImage.length) / file.size) * 100).toFixed(1) + '%'
          });
        }

        setFormData({
          ...formData,
          profilePicture: optimizedImage
        });
        setMessage('Ảnh đã được tối ưu hóa! Nhấn "Cập nhật thông tin" để lưu.');
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Image compression error:', error);
        }
        setMessage('Lỗi khi xử lý ảnh!');
      }
    }
  };

  // Image compression function
  const compressImage = (file, options = {}) => {
    const { maxWidth = 800, maxHeight = 800, quality = 0.8 } = options;
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;

          // Calculate new dimensions while maintaining aspect ratio
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          
          // Enable image smoothing for better quality
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to base64 with compression
          const compressed = canvas.toDataURL('image/jpeg', quality);
          resolve(compressed);
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target.result;
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Validate password if user wants to change it
    if (formData.newPassword || formData.confirmPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setMessage('Mật khẩu mới và xác nhận mật khẩu không trùng khớp!');
        setLoading(false);
        return;
      }
      if (formData.newPassword.length < 6) {
        setMessage('Mật khẩu mới phải có ít nhất 6 ký tự!');
        setLoading(false);
        return;
      }
    }

    if (process.env.NODE_ENV === 'development') {
      const imageSize = formData.profilePicture ? (formData.profilePicture.length / 1024).toFixed(2) : 0;
      console.log('Updating profile:', {
        username: formData.username,
        email: formData.email,
        profilePicture: formData.profilePicture ? `Image uploaded (${imageSize} KB)` : 'No image',
        userId: user._id || user.id
      });
    }

    try {
      // Update profile info
      const payload = {
        username: formData.username,
        email: formData.email,
        address: formData.address,
        dateOfBirth: formData.dateOfBirth,
        profilePicture: formData.profilePicture
      };

      const res = await fetch(`http://localhost:5000/api/users/${user._id || user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Cập nhật thất bại');
      }

      // If user wants to change password
      if (formData.currentPassword && formData.newPassword) {
        const pwRes = await fetch(`http://localhost:5000/api/users/${user._id || user.id}/change-password`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword
          })
        });

        const pwData = await pwRes.json();

        if (!pwRes.ok) {
          throw new Error(pwData.message || 'Đổi mật khẩu thất bại');
        }
      }

      // Update localStorage and Context (for real-time update in Header)
      const updatedUser = { 
        ...user, 
        username: data.user.username,
        email: data.user.email,
        address: data.user.address,
        dateOfBirth: data.user.dateOfBirth,
        profilePicture: data.user.profilePicture
      };
      
      // Update UserContext - This will update Header immediately!
      updateUserContext(updatedUser);
      
      // Also update local state
      setUser(updatedUser);

      // Show success state
      setSuccess(true);
      setMessage('Cập nhật thông tin thành công!');
      
      // Redirect to home after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };


  if (!user) {
    return <div className="p-6 text-center">Đang tải...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-600 via-violet-600 to-purple-700 dark:from-gray-900 dark:via-gray-800 dark:to-black pt-32 pb-12 relative transition-colors duration-500">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 flex flex-col items-center">
            <ImSpinner2 className="animate-spin text-violet-600 text-6xl mb-4" />
            <p className="text-gray-700 dark:text-gray-300 text-lg font-medium">Đang cập nhật...</p>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 flex flex-col items-center max-w-md mx-4">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <FaCheckCircle className="text-green-600 dark:text-green-400 text-5xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Thành công!</h3>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
              Thông tin của bạn đã được cập nhật thành công.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Đang chuyển về trang chủ...</p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-8 text-white">
            <h1 className="text-3xl font-bold">Trang cá nhân</h1>
            <p className="text-violet-100 mt-2">Quản lý thông tin của bạn</p>
          </div>

          <div className="p-8">
            {message && (
              <div className={`mb-6 p-4 rounded-lg ${message.includes('thành công') ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                  {message}
              </div>
              )}

            {/* Profile Picture */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-violet-600 bg-gray-200">
                  {formData.profilePicture ? (
                    <img 
                      src={formData.profilePicture} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                      <FaUser size={48} />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-violet-600 text-white p-2 rounded-full cursor-pointer hover:bg-violet-700 transition">
                  <FaCamera />
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Single Form */}
            <form onSubmit={handleUpdateProfile} className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Thông tin cá nhân</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FaUser className="inline mr-2" />
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-600 dark:focus:ring-violet-400 focus:border-transparent text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FaEnvelope className="inline mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-600 dark:focus:ring-violet-400 focus:border-transparent text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FaCalendar className="inline mr-2" />
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-600 dark:focus:ring-violet-400 focus:border-transparent text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-700"
                  />
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
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-600 dark:focus:ring-violet-400 focus:border-transparent text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-700"
                  />
                </div>
              </div>

              {/* Password Change Section */}
              <div className="border-t pt-6 mt-6 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Đổi mật khẩu (tùy chọn)</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Để trống nếu không muốn đổi mật khẩu</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FaLock className="inline mr-2" />
                      Mật khẩu hiện tại
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-600 dark:focus:ring-violet-400 focus:border-transparent text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-700"
                      placeholder=""
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FaLock className="inline mr-2" />
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-600 dark:focus:ring-violet-400 focus:border-transparent text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-700"
                      placeholder=""
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FaLock className="inline mr-2" />
                      Xác nhận mật khẩu mới
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-600 dark:focus:ring-violet-400 focus:border-transparent text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-700"
                      placeholder=""
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50 font-medium text-lg"
              >
                {loading ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
