import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCreditCard, FaLock, FaCheckCircle, FaExclamationTriangle, FaMobileAlt, FaUniversity, FaArrowLeft } from 'react-icons/fa';
import { ImSpinner2 } from 'react-icons/im';
import { useToast } from '../components/Toast';
import { useNotifications } from '../components/NotificationContext';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  
  const booking = location.state?.booking;
  
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!booking) {
      toast.error('Không tìm thấy thông tin booking');
      navigate('/');
    }
  }, [booking, navigate, toast]);

  if (!booking) return null;

  const totalAmount = booking.totalAmount || booking.house?.price || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const res = await fetch('http://localhost:5000/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking._id,
          amount: totalAmount,
          paymentMethod,
          cardLast4: cardNumber.slice(-4)
        })
      });

      if (!res.ok) throw new Error('Payment failed');

      await res.json();

      setSuccess(true);
      toast.success('Thanh toán thành công!');
      
      addNotification({
        type: 'booking',
        title: '💳 Thanh toán thành công!',
        message: `Bạn đã thanh toán $${totalAmount.toLocaleString()} cho "${booking.house?.name}". Booking đã được xác nhận!`
      });

      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (err) {
      setFailed(true);
      toast.error(err.message || 'Thanh toán thất bại. Vui lòng thử lại.');
      setLoading(false);
    }
  };

  const handlePayLater = () => {
    toast.info('Booking đã được lưu. Bạn có thể thanh toán sau.');
    addNotification({
      type: 'info',
      title: 'Thanh toán sau',
      message: `Booking "${booking.house?.name}" đã được lưu. Vui lòng thanh toán trong vòng 24h.`
    });
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.slice(0, 19);
  };

  const formatExpiry = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  // Success State
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-12 text-center max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FaCheckCircle className="text-6xl text-green-500" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Thanh toán thành công!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Booking của bạn đã được xác nhận. Đang chuyển về trang chủ...
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <ImSpinner2 className="animate-spin" />
            <span>Đang chuyển hướng...</span>
          </div>
        </motion.div>
      </div>
    );
  }

  // Failed State
  if (failed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-12 text-center max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FaExclamationTriangle className="text-6xl text-red-500" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Thanh toán thất bại
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setFailed(false)}
              className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition"
            >
              Thử lại
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 rounded-xl transition"
            >
              Về trang chủ
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Payment Form
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 mb-6 transition"
        >
          <FaArrowLeft />
          <span>Quay lại</span>
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Booking Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-6"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Chi tiết booking
              </h3>
              
              {/* House Image */}
              {booking.house?.image && (
                <img
                  src={booking.house.image}
                  alt={booking.house.name}
                  className="w-full h-40 object-cover rounded-xl mb-4"
                />
              )}

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Nhà:</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {booking.house?.name}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Ngày:</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(booking.startDate).toLocaleDateString('vi-VN')} - {new Date(booking.endDate).toLocaleDateString('vi-VN')}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400 text-xs mb-2">Tổng cộng:</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                    ${totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Payment Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <FaCreditCard className="text-white text-2xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Thanh toán
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Hoàn tất đặt phòng của bạn
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Payment Methods */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Phương thức thanh toán
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-4 border-2 rounded-xl transition-all ${
                        paymentMethod === 'card'
                          ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/20 shadow-lg'
                          : 'border-gray-200 dark:border-gray-700 hover:border-violet-300'
                      }`}
                    >
                      <FaCreditCard className={`text-2xl mx-auto mb-2 ${
                        paymentMethod === 'card' ? 'text-violet-600' : 'text-gray-400'
                      }`} />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Thẻ tín dụng</p>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bank')}
                      className={`p-4 border-2 rounded-xl transition-all ${
                        paymentMethod === 'bank'
                          ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/20 shadow-lg'
                          : 'border-gray-200 dark:border-gray-700 hover:border-violet-300'
                      }`}
                    >
                      <FaUniversity className={`text-2xl mx-auto mb-2 ${
                        paymentMethod === 'bank' ? 'text-violet-600' : 'text-gray-400'
                      }`} />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Chuyển khoản</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('momo')}
                      className={`p-4 border-2 rounded-xl transition-all ${
                        paymentMethod === 'momo'
                          ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/20 shadow-lg'
                          : 'border-gray-200 dark:border-gray-700 hover:border-violet-300'
                      }`}
                    >
                      <FaMobileAlt className={`text-2xl mx-auto mb-2 ${
                        paymentMethod === 'momo' ? 'text-violet-600' : 'text-gray-400'
                      }`} />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">MoMo</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('vnpay')}
                      className={`p-4 border-2 rounded-xl transition-all ${
                        paymentMethod === 'vnpay'
                          ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/20 shadow-lg'
                          : 'border-gray-200 dark:border-gray-700 hover:border-violet-300'
                      }`}
                    >
                      <FaMobileAlt className={`text-2xl mx-auto mb-2 ${
                        paymentMethod === 'vnpay' ? 'text-violet-600' : 'text-gray-400'
                      }`} />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">VNPay</p>
                    </button>
                  </div>
                </div>

                {/* Card Details */}
                {paymentMethod === 'card' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Số thẻ
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                        maxLength="19"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tên trên thẻ
                      </label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="NGUYEN VAN A"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white uppercase"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          MM/YY
                        </label>
                        <input
                          type="text"
                          value={expiry}
                          onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                          placeholder="12/25"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                          maxLength="5"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                          placeholder="123"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                          maxLength="3"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Bank Transfer */}
                {paymentMethod === 'bank' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
                  >
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                      Thông tin chuyển khoản
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Ngân hàng:</span>
                        <span className="font-medium text-gray-900 dark:text-white">Vietcombank</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Số TK:</span>
                        <span className="font-medium text-gray-900 dark:text-white">1234567890</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Chủ TK:</span>
                        <span className="font-medium text-gray-900 dark:text-white">HOMELAND COMPANY</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Nội dung:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          BOOKING {booking._id?.slice(-6)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* MoMo */}
                {paymentMethod === 'momo' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-pink-50 dark:bg-pink-900/20 rounded-xl border border-pink-200 dark:border-pink-800 text-center"
                  >
                    <div className="w-48 h-48 bg-white dark:bg-gray-700 mx-auto rounded-xl flex items-center justify-center mb-4">
                      <span className="text-gray-400">QR Code MoMo</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Quét mã QR để thanh toán ${totalAmount.toLocaleString()}
                    </p>
                  </motion.div>
                )}

                {/* VNPay */}
                {paymentMethod === 'vnpay' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
                  >
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Bạn sẽ được chuyển đến cổng thanh toán VNPay để hoàn tất giao dịch
                    </p>
                  </motion.div>
                )}

                {/* Security Notice */}
                <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <FaLock className="text-green-600 dark:text-green-400 text-lg" />
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Thông tin thanh toán được mã hóa và bảo mật
                  </p>
                </div>

                {/* Buttons */}
                <div className="space-y-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transition"
                  >
                    {loading ? (
                      <>
                        <ImSpinner2 className="animate-spin text-xl" />
                        <span>Đang xử lý...</span>
                      </>
                    ) : (
                      <>
                        <FaCreditCard />
                        <span>Thanh toán ${totalAmount.toLocaleString()}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handlePayLater}
                    className="w-full py-3 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 font-medium rounded-xl transition border border-yellow-200 dark:border-yellow-800"
                  >
                    Thanh toán sau (trong 24h)
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="w-full py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
