import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCreditCard, FaLock, FaCheckCircle, FaExclamationTriangle, FaMobileAlt, FaUniversity } from 'react-icons/fa';
import { ImSpinner2 } from 'react-icons/im';
import { useToast } from './Toast';
import { useNotifications } from './NotificationContext';

const PaymentModal = ({ isOpen, onClose, booking, onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const { toast } = useToast();
  const { addNotification } = useNotifications();

  // Don't render if not open or no booking
  if (!isOpen || !booking) return null;

  const totalAmount = booking.totalAmount || booking.house?.price || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Call payment API
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

      const data = await res.json();

      // Success!
      setSuccess(true);
      toast.success('Thanh toán thành công!');
      
      // Add notification
      addNotification({
        type: 'booking',
        title: '💳 Thanh toán thành công!',
        message: `Bạn đã thanh toán $${totalAmount.toLocaleString()} cho "${booking.house?.name}". Booking đã được xác nhận!`
      });

      setTimeout(() => {
        onPaymentSuccess && onPaymentSuccess(data);
        onClose();
        setSuccess(false);
      }, 2000);

    } catch (err) {
      setFailed(true);
      toast.error(err.message || 'Thanh toán thất bại. Vui lòng thử lại.');
    } finally {
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
      onClose();
    }, 1000);
  };

  const handleCancelBooking = () => {
    setShowCancelConfirm(true);
  };

  const confirmCancelBooking = () => {
    toast.warning('Đã hủy booking');
    onClose();
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.slice(0, 19); // 16 digits + 3 spaces
  };

  const formatExpiry = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Success State */}
            {success ? (
              <div className="p-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <FaCheckCircle className="text-5xl text-green-500" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Thanh toán thành công!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Booking của bạn đã được xác nhận
                </p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <FaCreditCard className="text-white text-xl" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          Thanh toán
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Hoàn tất đặt phòng
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <FaTimes className="text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Booking Summary */}
                <div className="p-6 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Chi tiết booking
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Nhà:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {booking.house?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Ngày:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {new Date(booking.startDate).toLocaleDateString('vi-VN')} - {new Date(booking.endDate).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-300 dark:border-gray-600">
                      <span className="font-semibold text-gray-900 dark:text-white">Tổng cộng:</span>
                      <span className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                        ${totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Form */}
                <form onSubmit={handleSubmit} className="p-6">
                  {/* Payment Method */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Phương thức thanh toán
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-3 border-2 rounded-xl transition-all ${
                          paymentMethod === 'card'
                            ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-violet-300'
                        }`}
                      >
                        <FaCreditCard className={`text-xl mx-auto mb-1 ${
                          paymentMethod === 'card' ? 'text-violet-600' : 'text-gray-400'
                        }`} />
                        <p className="text-xs font-medium text-gray-900 dark:text-white">Thẻ tín dụng</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('bank')}
                        className={`p-3 border-2 rounded-xl transition-all ${
                          paymentMethod === 'bank'
                            ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-violet-300'
                        }`}
                      >
                        <FaUniversity className={`text-xl mx-auto mb-1 ${
                          paymentMethod === 'bank' ? 'text-violet-600' : 'text-gray-400'
                        }`} />
                        <p className="text-xs font-medium text-gray-900 dark:text-white">Chuyển khoản</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('momo')}
                        className={`p-3 border-2 rounded-xl transition-all ${
                          paymentMethod === 'momo'
                            ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-violet-300'
                        }`}
                      >
                        <FaMobileAlt className={`text-xl mx-auto mb-1 ${
                          paymentMethod === 'momo' ? 'text-violet-600' : 'text-gray-400'
                        }`} />
                        <p className="text-xs font-medium text-gray-900 dark:text-white">MoMo</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('vnpay')}
                        className={`p-3 border-2 rounded-xl transition-all ${
                          paymentMethod === 'vnpay'
                            ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-violet-300'
                        }`}
                      >
                        <FaMobileAlt className={`text-xl mx-auto mb-1 ${
                          paymentMethod === 'vnpay' ? 'text-violet-600' : 'text-gray-400'
                        }`} />
                        <p className="text-xs font-medium text-gray-900 dark:text-white">VNPay</p>
                      </button>
                    </div>
                  </div>

                  {/* Card Details */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-4">
                      {/* Card Number */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Số thẻ
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          placeholder=""
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                          required
                          maxLength="19"
                        />
                      </div>

                      {/* Card Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Tên trên thẻ
                        </label>
                        <input
                          type="text"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder=""
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                          required
                        />
                      </div>

                      {/* Expiry & CVV */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            MM/YY
                          </label>
                          <input
                            type="text"
                            value={expiry}
                            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                            placeholder=""
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
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
                            placeholder=""
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                            required
                            maxLength="3"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bank Transfer Info */}
                  {paymentMethod === 'bank' && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Thông tin chuyển khoản
                      </h4>
                      <div className="space-y-2 text-sm">
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
                    </div>
                  )}

                  {/* MoMo Info */}
                  {paymentMethod === 'momo' && (
                    <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-xl border border-pink-200 dark:border-pink-800">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Thanh toán qua MoMo
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Quét mã QR hoặc nhập số điện thoại MoMo để thanh toán
                      </p>
                      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg text-center">
                        <div className="w-32 h-32 bg-gray-200 dark:bg-gray-600 mx-auto rounded-lg flex items-center justify-center mb-2">
                          <span className="text-gray-500 dark:text-gray-400 text-xs">QR Code</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Số tiền: ${totalAmount.toLocaleString()}</p>
                      </div>
                    </div>
                  )}

                  {/* VNPay Info */}
                  {paymentMethod === 'vnpay' && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Thanh toán qua VNPay
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Bạn sẽ được chuyển đến cổng thanh toán VNPay để hoàn tất giao dịch
                      </p>
                    </div>
                  )}

                  {/* Security Notice */}
                  <div className="flex items-center gap-2 mt-6 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <FaLock className="text-green-600 dark:text-green-400" />
                    <p className="text-xs text-green-700 dark:text-green-400">
                      Thông tin thanh toán được mã hóa và bảo mật
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
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

                  {/* Pay Later Button */}
                  <button
                    type="button"
                    onClick={handlePayLater}
                    className="w-full mt-3 py-3 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 font-medium rounded-xl transition-colors border border-yellow-200 dark:border-yellow-800"
                  >
                    Thanh toán sau (trong 24h)
                  </button>

                  {/* Cancel Button */}
                  <button
                    type="button"
                    onClick={handleCancelBooking}
                    className="w-full mt-2 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-colors"
                  >
                    Hủy booking
                  </button>
                </form>
              </>
            )}

            {/* Failed State */}
            {failed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-white dark:bg-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6"
                >
                  <FaExclamationTriangle className="text-5xl text-red-500" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Thanh toán thất bại
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                  Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.
                </p>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setFailed(false)}
                    className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition"
                  >
                    Thử lại
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 rounded-xl transition"
                  >
                    Đóng
                  </button>
                </div>
              </motion.div>
            )}

            {/* Cancel Confirmation */}
            {showCancelConfirm && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-white dark:bg-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="w-24 h-24 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-6"
                >
                  <FaExclamationTriangle className="text-5xl text-orange-500" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Xác nhận hủy booking
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                  Bạn có chắc chắn muốn hủy booking này? Hành động này không thể hoàn tác.
                </p>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setShowCancelConfirm(false)}
                    className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 rounded-xl transition"
                  >
                    Quay lại
                  </button>
                  <button
                    onClick={confirmCancelBooking}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition"
                  >
                    Xác nhận hủy
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;
