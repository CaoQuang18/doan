import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaClock, FaHome, FaCalendarAlt } from 'react-icons/fa';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ total: 0, confirmed: 0, cancelled: 0, pending: 0 });

  // Load bookings từ API
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/bookings');
      const data = await res.json();
      setBookings(data);
      
      // Calculate stats
      const total = data.length;
      const confirmed = data.filter(b => b.status === 'confirmed').length;
      const cancelled = data.filter(b => b.status === 'cancelled').length;
      const pending = data.filter(b => b.status === 'pending').length;
      setStats({ total, confirmed, cancelled, pending });
    } catch (err) {
      setError('Không thể tải danh sách bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Lọc theo status
  const filtered = filter === 'All' 
    ? bookings 
    : bookings.filter(b => b.status === filter.toLowerCase());

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
          Quản lý đặt phòng
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Hệ thống tự động duyệt booking khi phòng còn trống</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 rounded-lg shadow-md">
          <div className="flex items-center gap-2">
            <FaTimesCircle />
            <span className="font-semibold">{error}</span>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-l-4 border-violet-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Tổng booking</p>
              <p className="text-3xl font-black text-gray-900 dark:text-white mt-2">{stats.total}</p>
            </div>
            <FaHome className="text-4xl text-violet-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Đã xác nhận</p>
              <p className="text-3xl font-black text-green-600 dark:text-green-400 mt-2">{stats.confirmed}</p>
            </div>
            <FaCheckCircle className="text-4xl text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Đang chờ</p>
              <p className="text-3xl font-black text-yellow-600 dark:text-yellow-400 mt-2">{stats.pending}</p>
            </div>
            <FaClock className="text-4xl text-yellow-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Đã hủy</p>
              <p className="text-3xl font-black text-red-600 dark:text-red-400 mt-2">{stats.cancelled}</p>
            </div>
            <FaTimesCircle className="text-4xl text-red-500" />
          </div>
        </div>
      </div>

      {/* Filter buttons */}
      <div className="flex gap-3 mb-6">
        {['All', 'Pending', 'Confirmed', 'Cancelled'].map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              filter === type 
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg scale-105' 
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-violet-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">Đang tải dữ liệu...</p>
          </div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
          <FaCalendarAlt className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-500 dark:text-gray-400">Chưa có booking nào</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Các booking sẽ được tự động duyệt khi khách đặt phòng</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FaCalendarAlt />
              Danh sách booking ({filtered.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">STT</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Khách hàng</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Căn hộ</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Thời gian thuê</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Ghi chú</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filtered.map((booking, index) => (
                  <tr key={booking._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{index + 1}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {booking.user?.username?.charAt(0).toUpperCase() || 'N'}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {booking.user?.username || 'N/A'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {booking.user?.email || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <FaHome className="text-violet-600" />
                          {booking.house?.name || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {booking.house?.address || 'N/A'}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {new Date(booking.startDate).toLocaleDateString('vi-VN')}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">đến</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {new Date(booking.endDate).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {booking.status === 'confirmed' ? (
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm font-bold">
                          <FaCheckCircle />
                          Đã xác nhận
                        </span>
                      ) : booking.status === 'cancelled' ? (
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-sm font-bold">
                          <FaTimesCircle />
                          Đã hủy
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-sm font-bold">
                          <FaClock />
                          Đang chờ
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {booking.status === 'confirmed' ? (
                        <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                          ✅ Tự động duyệt
                        </div>
                      ) : booking.status === 'cancelled' ? (
                        <div className="text-xs text-red-600 dark:text-red-400 font-medium">
                          ❌ Đã bị hủy
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Đang xử lý
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Info */}
          <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-sm">
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-white">{filtered.length}</span> booking được hiển thị
              </p>
              <p className="text-gray-500 dark:text-gray-400 italic">
                💡 Hệ thống tự động duyệt khi phòng còn trống
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
