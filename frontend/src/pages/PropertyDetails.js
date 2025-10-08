import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BiBed, BiBath, BiArea } from "react-icons/bi";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import { useToast } from "../components/Toast";
import { HouseContext } from "../components/HouseContext";
import { FavoritesContext } from "../components/FavoritesContext";
import { useNotifications } from "../components/NotificationContext";
import ImageGallery from "../components/ImageGallery";
import House from "../components/House";
import { getImageUrl } from "../utils/imageHelper";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { houses } = useContext(HouseContext);
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);
  const { addNotification } = useNotifications();
  const house = houses.find((house) => house._id === id);
  const houseId = house ? (house._id || house.id) : null;
  const favorite = houseId ? isFavorite(houseId) : false;

  const { toast } = useToast();

  const handleFavoriteClick = () => {
    // Check if user is logged in
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      // Fallback to alert if toast is not available
      if (toast && toast.warning) {
        toast.warning('Vui lòng đăng nhập để sử dụng tính năng yêu thích!');
      } else {
        alert('Vui lòng đăng nhập để sử dụng tính năng yêu thích!');
      }
      window.location.href = '/login';
      return; // Stop execution here
    }

    if (house && houseId) {
      toggleFavorite({ ...house, id: houseId });
      
      if (!favorite) {
        // Adding to favorites
        if (toast && toast.success) {
          toast.success('Đã thêm vào danh sách yêu thích');
        }
        addNotification({
          type: 'favorite',
          title: 'Đã thêm yêu thích!',
          message: `"${house.name}" đã được thêm vào danh sách yêu thích của bạn.`
        });
      } else {
        // Removing from favorites
        if (toast && toast.success) {
          toast.success('Đã xóa khỏi danh sách yêu thích');
        }
      }
    }
  };
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  // Set min date to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
    setEndDate(today);
  }, []);

  // Check availability when dates change
  useEffect(() => {
    const checkAvailability = async () => {
      if (!startDate || !endDate || !house?._id) return;
      
      setCheckingAvailability(true);
      try {
        const res = await fetch(
          `http://localhost:5000/api/bookings/check-availability?houseId=${house._id}&startDate=${startDate}&endDate=${endDate}`
        );
        const data = await res.json();
        setAvailability(data);
      } catch (error) {
        console.error('Error checking availability:', error);
      } finally {
        setCheckingAvailability(false);
      }
    };

    // Debounce the check
    const timer = setTimeout(checkAvailability, 500);
    return () => clearTimeout(timer);
  }, [startDate, endDate, house]);


  const handleBooking = async (e) => {
    e.preventDefault();

    // Check if user is logged in
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      if (toast && toast.warning) {
        toast.warning('Vui lòng đăng nhập để đặt phòng!');
      } else {
        alert('Vui lòng đăng nhập để đặt phòng!');
      }
      window.location.href = '/login';
      return;
    }

    const user = JSON.parse(userStr);

    if (!startDate || !endDate) {
      if (toast && toast.error) {
        toast.error('Vui lòng chọn ngày bắt đầu và kết thúc!');
      } else {
        alert('Vui lòng chọn ngày bắt đầu và kết thúc!');
      }
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      if (toast && toast.error) {
        toast.error('Ngày kết thúc phải sau ngày bắt đầu!');
      } else {
        alert('Ngày kết thúc phải sau ngày bắt đầu!');
      }
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: user.id,
          house: house._id,
          startDate,
          endDate
        })
      });

      const data = await res.json();

      if (!res.ok) {
        // Hiển thị thông báo lỗi chi tiết nếu trùng lịch
        if (res.status === 409 && data.conflicts) {
          const conflictMsg = `Nhà này đã có người đặt trong khoảng thời gian bạn chọn. Vui lòng chọn ngày khác.`;
          if (toast && toast.error) {
            toast.error(conflictMsg);
          } else {
            alert(conflictMsg);
          }
        } else {
          throw new Error(data.message || 'Đặt phòng thất bại');
        }
        return;
      }

      // Success notification - Tự động duyệt
      if (toast && toast.success) {
        toast.success('Đặt phòng thành công! Booking đã được tự động xác nhận. Vui lòng thanh toán.');
      }
      
      // Add notification
      addNotification({
        type: 'booking',
        title: 'Đặt phòng thành công!',
        message: `Bạn đã đặt "${house.name}" từ ${new Date(startDate).toLocaleDateString('vi-VN')} đến ${new Date(endDate).toLocaleDateString('vi-VN')}. Booking đã được tự động xác nhận!`
      });
      
      // Redirect to payment page
      navigate('/payment', {
        state: {
          booking: {
            ...data,
            house: house,
            startDate,
            endDate,
            totalAmount: house.price
          }
        }
      });
    } catch (err) {
      if (toast && toast.error) {
        toast.error(err.message || 'Có lỗi xảy ra khi đặt phòng. Vui lòng thử lại.');
      } else {
        alert(err.message || 'Có lỗi xảy ra khi đặt phòng. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!house) {
    return <div className="p-6 text-center">Không tìm thấy nhà này</div>;
  }

  // Create multiple images array (use same image if no gallery available)
  // Make sure to use getImageUrl to convert relative paths to full URLs
  const houseImages = house.images || [
    getImageUrl(house.imageLg || house.image),
    getImageUrl(house.image),
    getImageUrl(house.imageLg || house.image),
    getImageUrl(house.image),
    getImageUrl(house.imageLg || house.image),
  ];

  return (
    <section className="bg-white dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl pt-20 pb-12">
        {/* Header Section */}
        <div className="mb-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <Link to="/" className="hover:text-violet-600 transition">Trang chủ</Link>
            <span>›</span>
            <Link to="/" className="hover:text-violet-600 transition">{house.type}</Link>
            <span>›</span>
            <span className="text-gray-900 dark:text-white">{house.name}</span>
          </div>

          {/* Title & Actions */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {house.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <FaStar className="text-yellow-400" />
                  <span className="font-semibold text-gray-900 dark:text-white">4.8</span>
                  <span className="text-gray-600 dark:text-gray-400">(24 đánh giá)</span>
                </div>
                <span className="text-gray-400">•</span>
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>{house.address}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleFavoriteClick}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                {favorite ? (
                  <FaHeart className="text-red-500" />
                ) : (
                  <FaRegHeart className="text-gray-600 dark:text-gray-400" />
                )}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Lưu</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Chia sẻ</span>
              </button>
            </div>
          </div>
        </div>

        {/* Image Gallery - Full Width */}
        <div className="mb-8 rounded-xl overflow-hidden">
          <ImageGallery images={houseImages} houseName={house.name} />
        </div>

        {/* Main Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Host Info Card */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    {house.type} cho thuê bởi {house.agent.name}
                  </h2>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <span>{house.bedrooms} phòng ngủ</span>
                    <span>•</span>
                    <span>{house.bathrooms} phòng tắm</span>
                    <span>•</span>
                    <span>{house.surface}</span>
                  </div>
                </div>
                <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={house.agent.image}
                    alt={house.agent.name}
                    className="object-cover w-full h-full"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            {/* Property Features Grid */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <BiBed className="text-3xl text-gray-700 dark:text-gray-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {house.bedrooms} Phòng ngủ rộng rãi
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Phòng ngủ thoáng mát, đầy đủ nội thất
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <BiBath className="text-3xl text-gray-700 dark:text-gray-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {house.bathrooms} Phòng tắm hiện đại
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Thiết bị vệ sinh cao cấp
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <BiArea className="text-3xl text-gray-700 dark:text-gray-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Diện tích {house.surface}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Không gian sống thoải mái
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      An toàn & Bảo mật
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Hệ thống an ninh 24/7
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Mô tả chi tiết
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {house.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Tiện nghi nổi bật
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: '📶', name: 'Wifi miễn phí' },
                  { icon: '❄️', name: 'Điều hòa nhiệt độ' },
                  { icon: '🚗', name: 'Chỗ đậu xe miễn phí' },
                  { icon: '🧺', name: 'Máy giặt' },
                  { icon: '🍳', name: 'Bếp đầy đủ' },
                  { icon: '📺', name: 'TV màn hình phẳng' },
                  { icon: '🏊', name: 'Hồ bơi' },
                  { icon: '🏋️', name: 'Phòng gym' }
                ].map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-2xl">{amenity.icon}</span>
                    <span className="text-gray-700 dark:text-gray-300">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <FaStar className="text-yellow-400 text-xl" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    4.8 · 24 đánh giá
                  </h2>
                </div>
              </div>
              
              {/* Rating Breakdown */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {[
                  { label: 'Sạch sẽ', score: 4.9 },
                  { label: 'Chính xác', score: 4.8 },
                  { label: 'Liên lạc', score: 4.7 },
                  { label: 'Vị trí', score: 4.9 },
                  { label: 'Nhận phòng', score: 4.8 },
                  { label: 'Giá trị', score: 4.6 }
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.score}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                      <div 
                        className="bg-gray-900 dark:bg-white h-1 rounded-full" 
                        style={{ width: `${(item.score / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Write Review Form */}
              <div className="mb-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Viết đánh giá của bạn
                </h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const userStr = localStorage.getItem('user');
                  if (!userStr) {
                    if (toast && toast.warning) {
                      toast.warning('Vui lòng đăng nhập để viết đánh giá!');
                    } else {
                      alert('Vui lòng đăng nhập để viết đánh giá!');
                    }
                    window.location.href = '/login';
                    return;
                  }
                  if (reviewRating === 0) {
                    if (toast && toast.error) {
                      toast.error('Vui lòng chọn số sao đánh giá!');
                    } else {
                      alert('Vui lòng chọn số sao đánh giá!');
                    }
                    return;
                  }
                  if (!reviewComment.trim()) {
                    if (toast && toast.error) {
                      toast.error('Vui lòng nhập nhận xét!');
                    } else {
                      alert('Vui lòng nhập nhận xét!');
                    }
                    return;
                  }
                  if (toast && toast.success) {
                    toast.success('Cảm ơn bạn đã đánh giá!');
                  }
                  setReviewRating(0);
                  setReviewComment('');
                }} className="space-y-4">
                  {/* Rating Stars */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Đánh giá của bạn {reviewRating > 0 && `(${reviewRating} sao)`}
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="text-3xl transition-colors"
                        >
                          <FaStar className={`${
                            star <= (hoverRating || reviewRating)
                              ? 'text-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nhận xét
                    </label>
                    <textarea
                      rows="4"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Chia sẻ trải nghiệm của bạn về căn hộ này..."
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:text-white resize-none"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition shadow-md hover:shadow-lg"
                  >
                    Gửi đánh giá
                  </button>
                </form>
              </div>

              {/* Reviews List */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Đánh giá từ khách hàng
                </h3>
                {[
                  { 
                    name: "Nguyễn Văn A", 
                    avatar: "N",
                    date: "Tháng 9, 2024",
                    rating: 5,
                    comment: "Căn hộ rất đẹp và sạch sẽ. Vị trí thuận lợi, gần trung tâm. Chủ nhà rất thân thiện và nhiệt tình. Tôi rất hài lòng với chuyến ở này!"
                  },
                  { 
                    name: "Trần Thị B", 
                    avatar: "T",
                    date: "Tháng 8, 2024",
                    rating: 4,
                    comment: "Nơi ở tuyệt vời! Đầy đủ tiện nghi, view đẹp. Sẽ quay lại lần sau."
                  }
                ].map((review, idx) => (
                  <div key={idx} className="flex gap-4 pb-6 border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg">{review.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <div className="mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{review.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{review.date}</p>
                      </div>
                      <div className="flex gap-1 mb-2">
                        {[...Array(review.rating)].map((_, i) => (
                          <FaStar key={i} className="text-yellow-400 text-sm" />
                        ))}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Host Information Section */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Thông tin chủ nhà
              </h2>
              
              <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-violet-200 dark:border-violet-800">
                {/* Host Profile */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-white dark:ring-gray-800 shadow-lg flex-shrink-0">
                    <img
                      src={house.agent.image}
                      alt={house.agent.name}
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {house.agent.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Chủ nhà · Tham gia từ 2020
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <FaStar className="text-yellow-400" />
                        <span className="font-semibold text-gray-900 dark:text-white">4.9</span>
                        <span className="text-gray-600 dark:text-gray-400">(156 đánh giá)</span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        <span className="font-semibold text-gray-900 dark:text-white">48</span> căn hộ
                      </span>
                    </div>
                  </div>
                </div>

                {/* Host Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-violet-600 dark:text-violet-400 mb-1">
                      98%
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Tỷ lệ phản hồi
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-violet-600 dark:text-violet-400 mb-1">
                      &lt; 1h
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Thời gian phản hồi
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-violet-600 dark:text-violet-400 mb-1">
                      4.5+
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Năm kinh nghiệm
                    </div>
                  </div>
                </div>

                {/* Host Badges */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Huy hiệu & Chứng nhận
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg border border-violet-200 dark:border-violet-800">
                      <svg className="w-5 h-5 text-violet-600 dark:text-violet-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Chủ nhà uy tín</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg border border-violet-200 dark:border-violet-800">
                      <svg className="w-5 h-5 text-violet-600 dark:text-violet-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Đã xác minh</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg border border-violet-200 dark:border-violet-800">
                      <svg className="w-5 h-5 text-violet-600 dark:text-violet-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Phản hồi nhanh</span>
                    </div>
                  </div>
                </div>

                {/* Host Bio */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Giới thiệu
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    Xin chào! Tôi là {house.agent.name}, chủ sở hữu của nhiều căn hộ cao cấp tại khu vực. 
                    Với hơn 4 năm kinh nghiệm trong lĩnh vực cho thuê bất động sản, tôi cam kết mang đến 
                    cho khách hàng những trải nghiệm lưu trú tuyệt vời nhất. Tôi luôn sẵn sàng hỗ trợ và 
                    đảm bảo mọi nhu cầu của bạn được đáp ứng một cách tốt nhất.
                  </p>
                </div>

                {/* Host Languages */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Ngôn ngữ
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                      🇻🇳 Tiếng Việt
                    </span>
                    <span className="bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                      🇬🇧 English
                    </span>
                    <span className="bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                      🇰🇷 한국어
                    </span>
                  </div>
                </div>

                {/* Contact Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowPhoneModal(true)}
                    className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold py-3 rounded-lg transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Gọi điện
                  </button>
                  <button 
                    onClick={() => setShowChatModal(true)}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition shadow-md hover:shadow-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Nhắn tin
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Right Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div id="booking-form" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">${parseInt(house.price).toLocaleString()}</span>
                  <span className="text-gray-600 dark:text-gray-400">/tháng</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <FaStar className="text-yellow-400" />
                  <span className="font-semibold text-gray-900 dark:text-white">4.8</span>
                  <span className="text-gray-600 dark:text-gray-400">· 24 đánh giá</span>
                </div>
              </div>

              {/* Booking Form */}
              <form onSubmit={handleBooking} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nhận phòng
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Trả phòng
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                      required
                    />
                  </div>
                </div>

                {/* Availability Status */}
                {checkingAvailability && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 text-center py-2">
                    Đang kiểm tra tình trạng...
                  </div>
                )}
                {availability && !availability.available && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <p className="text-sm text-red-700 dark:text-red-400">Không có sẵn trong thời gian này</p>
                  </div>
                )}
                {availability && availability.available && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                    <p className="text-sm text-green-700 dark:text-green-400">✓ Có sẵn</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || (availability && !availability.available)}
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  {loading ? 'Đang xử lý...' : 'Đặt phòng'}
                </button>
              </form>

              <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
                Bạn sẽ chưa bị tính phí
              </p>

              {/* Price Breakdown */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400 underline">${house.price} x 1 tháng</span>
                  <span className="text-gray-900 dark:text-white">${house.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400 underline">Phí dịch vụ</span>
                  <span className="text-gray-900 dark:text-white">$0</span>
                </div>
                <div className="flex justify-between font-semibold pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-900 dark:text-white">Tổng cộng</span>
                  <span className="text-gray-900 dark:text-white">${house.price}</span>
                </div>
              </div>

              {/* Contact Host */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={house.agent.image}
                      alt={house.agent.name}
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{house.agent.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Chủ nhà</p>
                  </div>
                </div>
                <a
                  href={`tel:${house.agent.phone || '0123456789'}`}
                  className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold py-2.5 rounded-lg text-sm transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Liên hệ chủ nhà
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Nhà cho thuê tương tự</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {houses
              .filter(h => h._id !== house._id && h.type === house.type)
              .slice(0, 3)
              .map((similarHouse, idx) => (
                <motion.div
                  key={similarHouse._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <House house={similarHouse} />
                </motion.div>
              ))}
          </div>
          {houses.filter(h => h._id !== house._id && h.type === house.type).length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">Không có nhà tương tự</p>
          )}
        </div>
      </div>

      {/* Phone Modal */}
      {showPhoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowPhoneModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Liên hệ chủ nhà</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Gọi điện để được tư vấn trực tiếp</p>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Số điện thoại</p>
                <a href="tel:+84123456789" className="text-3xl font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700">
                  +84 123 456 789
                </a>
              </div>

              <div className="flex gap-3">
                <a
                  href="tel:+84123456789"
                  className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition"
                >
                  Gọi ngay
                </a>
                <button
                  onClick={() => setShowPhoneModal(false)}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 rounded-xl transition"
                >
                  Đóng
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Chat Modal - Facebook Style */}
      {showChatModal && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-0 right-6 z-[9998] w-[360px] bg-white dark:bg-gray-800 rounded-t-2xl shadow-2xl overflow-hidden"
          style={{ height: '500px' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <img
                  src={house.agent?.image || "https://i.pravatar.cc/150?img=1"}
                  alt="Host"
                  className="w-9 h-9 rounded-full border-2 border-white"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Sofia Gomes</h3>
                <p className="text-[10px] text-white/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                  Đang hoạt động
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setShowChatModal(false)}
                className="text-white hover:bg-white/20 p-1.5 rounded-full transition"
                title="Thu nhỏ"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <button
                onClick={() => setShowChatModal(false)}
                className="text-white hover:bg-white/20 p-1.5 rounded-full transition"
                title="Đóng"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 p-3 overflow-y-auto bg-gray-50 dark:bg-gray-900" style={{ height: 'calc(100% - 110px)' }}>
            <div className="space-y-2">
              {/* Host message */}
              <div className="flex justify-start">
                <div className="flex gap-2 max-w-[75%]">
                  <img
                    src={house.agent?.image || "https://i.pravatar.cc/150?img=1"}
                    alt="Host"
                    className="w-7 h-7 rounded-full flex-shrink-0"
                  />
                  <div>
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl rounded-tl-sm px-3 py-2">
                      <p className="text-sm text-gray-800 dark:text-gray-200">Xin chào! 👋</p>
                    </div>
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl px-3 py-2 mt-1">
                      <p className="text-sm text-gray-800 dark:text-gray-200">Tôi có thể giúp gì cho bạn về căn nhà này?</p>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 px-2">10:30</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="p-2 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <button className="text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 p-2 rounded-full transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Aa"
                className="flex-1 rounded-full px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && chatMessage.trim()) {
                    toast.success('Tin nhắn đã được gửi!');
                    setChatMessage('');
                  }
                }}
              />
              <button className="text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 p-2 rounded-full transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              {chatMessage.trim() ? (
                <button
                  onClick={() => {
                    toast.success('Tin nhắn đã được gửi!');
                    setChatMessage('');
                  }}
                  className="text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 p-2 rounded-full transition"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
              ) : (
                <button className="text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 p-2 rounded-full transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default PropertyDetails;
