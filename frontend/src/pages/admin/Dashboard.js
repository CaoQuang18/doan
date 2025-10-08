import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Download } from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip as PieTooltip, Legend as PieLegend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import RevenueChart from '../../components/admin/RevenueChart';
import PopularHousesChart from '../../components/admin/PopularHousesChart';
import BookingCalendar from '../../components/admin/BookingCalendar';
import { exportAnalyticsReport, exportHouses, exportBookings } from '../../utils/exportUtils';

export default function Dashboard() {
  const [houses, setHouses] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load data từ API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [housesRes, usersRes, bookingsRes] = await Promise.all([
          fetch('http://localhost:5000/api/houses'),
          fetch('http://localhost:5000/api/users'),
          fetch('http://localhost:5000/api/bookings')
        ]);

        const housesData = await housesRes.json();
        const usersData = await usersRes.json();
        const bookingsData = await bookingsRes.json();

        setHouses(housesData);
        setUsers(usersData);
        setBookings(bookingsData);
      } catch (err) {
        console.error('Không thể tải dữ liệu:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 1. Đếm số lượng theo loại nhà
  const typeStats = useMemo(() => {
    const counts = {};
    houses.forEach(h => {
      counts[h.type] = (counts[h.type] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [houses]);

  // 2. Số lượng theo quốc gia
  const countryStats = useMemo(() => {
    const counts = {};
    houses.forEach(h => {
      counts[h.country] = (counts[h.country] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [houses]);

  // 3. Giá trung bình theo loại nhà
  const avgPriceByType = useMemo(() => {
    const sums = {};
    const counts = {};
    houses.forEach(h => {
      sums[h.type] = (sums[h.type] || 0) + h.price;
      counts[h.type] = (counts[h.type] || 0) + 1;
    });
    return Object.keys(sums).map(type => ({
      type,
      avgPrice: Math.round(sums[type] / counts[type])
    }));
  }, [houses]);

  // Thống kê nâng cao (phải đặt trước early return)
  const totalRevenue = useMemo(() => {
    return bookings
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => sum + (b.house?.price || 0), 0);
  }, [bookings]);

  const pendingBookings = useMemo(() => {
    return bookings.filter(b => b.status === 'pending').length;
  }, [bookings]);

  const availableHouses = useMemo(() => {
    return houses.filter(h => h.status === 'Trả phòng').length;
  }, [houses]);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1'];

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg animate-pulse">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const handleExportReport = () => {
    exportAnalyticsReport({
      totalUsers: users.length,
      totalHouses: houses.length,
      totalBookings: bookings.length,
      totalRevenue,
      pendingBookings,
      availableHouses
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with Export Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <div className="flex gap-2">
          <button
            onClick={() => exportHouses(houses)}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center gap-2"
          >
            <Download size={16} />
            Export Houses
          </button>
          <button
            onClick={() => exportBookings(bookings)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2"
          >
            <Download size={16} />
            Export Bookings
          </button>
          <button
            onClick={handleExportReport}
            className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg flex items-center gap-2"
          >
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      {/* Metrics Cards with Animations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg hover:shadow-2xl text-white cursor-pointer group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          whileHover={{ scale: 1.05, y: -5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-blue-100 text-sm font-medium mb-2">Tổng Users</h3>
              <p className="text-4xl font-bold">{users.length}</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp size={14} className="text-green-300" />
                <p className="text-blue-100 text-xs">+{users.filter(u => u.role === 'user').length} users</p>
              </div>
            </div>
            <div className="bg-white/20 p-4 rounded-2xl group-hover:scale-110">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg hover:shadow-2xl text-white cursor-pointer group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.05, y: -5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-green-100 text-sm font-medium mb-2">Tổng Houses</h3>
              <p className="text-4xl font-bold">{houses.length}</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp size={14} className="text-green-300" />
                <p className="text-green-100 text-xs">{availableHouses} available</p>
              </div>
            </div>
            <div className="bg-white/20 p-4 rounded-2xl group-hover:scale-110">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg hover:shadow-2xl text-white cursor-pointer group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05, y: -5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-purple-100 text-sm font-medium mb-2">Tổng Bookings</h3>
              <p className="text-4xl font-bold">{bookings.length}</p>
              <div className="flex items-center gap-1 mt-2">
                {pendingBookings > 0 ? (
                  <TrendingUp size={14} className="text-yellow-300" />
                ) : (
                  <TrendingDown size={14} className="text-red-300" />
                )}
                <p className="text-purple-100 text-xs">{pendingBookings} pending</p>
              </div>
            </div>
            <div className="bg-white/20 p-4 rounded-2xl group-hover:scale-110">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-gradient-to-br from-yellow-500 to-orange-500 p-6 rounded-xl shadow-lg hover:shadow-2xl text-white cursor-pointer group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05, y: -5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-yellow-100 text-sm font-medium mb-2">Doanh thu</h3>
              <p className="text-4xl font-bold">${totalRevenue.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp size={14} className="text-green-300" />
                <p className="text-yellow-100 text-xs">From confirmed bookings</p>
              </div>
            </div>
            <div className="bg-white/20 p-4 rounded-2xl group-hover:scale-110">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts with Better Styling */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pie Chart - Property Types */}
        <motion.div 
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Tỷ lệ loại bất động sản</h2>
            <div className="px-3 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-full text-xs font-semibold">
              {typeStats.length} types
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={typeStats}
                cx="50%" cy="50%"
                innerRadius={70} outerRadius={110}
                paddingAngle={3}
                dataKey="value" 
                label={(entry) => `${entry.name}: ${entry.value}`}
              >
                {typeStats.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <PieTooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <PieLegend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Bar Chart - Countries */}
        <motion.div 
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Số lượng theo quốc gia</h2>
            <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold">
              {countryStats.length} countries
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={countryStats} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Legend />
              <Bar dataKey="value" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Horizontal Bar Chart - Average Prices */}
        <motion.div 
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out border border-gray-200 dark:border-gray-700 lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Giá trung bình từng loại nhà ($)</h2>
            <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-xs font-semibold">
              Average pricing
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={avgPriceByType}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#6b7280" />
              <YAxis dataKey="type" type="category" stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Legend />
              <Bar dataKey="avgPrice" fill="url(#priceGradient)" radius={[0, 8, 8, 0]} />
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* New Enhanced Charts */}
      <div className="grid gap-6 lg:grid-cols-2 mt-6">
        {/* Revenue Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <RevenueChart bookings={bookings} />
        </motion.div>

        {/* Popular Houses Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <PopularHousesChart houses={houses} bookings={bookings} />
        </motion.div>
      </div>

      {/* Booking Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="mt-6"
      >
        <BookingCalendar 
          bookings={bookings}
          onDateClick={(date, dayBookings) => {
            console.log('Selected date:', date, 'Bookings:', dayBookings);
            // TODO: Show modal with booking details
          }}
        />
      </motion.div>
    </div>
  );
}
