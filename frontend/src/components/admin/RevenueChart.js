// components/admin/RevenueChart.js - Revenue analytics chart
import React, { useMemo } from 'react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const RevenueChart = ({ bookings }) => {
  // Calculate revenue by month
  const revenueData = useMemo(() => {
    const monthlyRevenue = {};
    
    bookings.forEach(booking => {
      if (booking.status === 'confirmed' && booking.createdAt) {
        const date = new Date(booking.createdAt);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthName = date.toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' });
        
        if (!monthlyRevenue[monthKey]) {
          monthlyRevenue[monthKey] = {
            month: monthName,
            revenue: 0,
            bookings: 0
          };
        }
        
        monthlyRevenue[monthKey].revenue += booking.house?.price || 0;
        monthlyRevenue[monthKey].bookings += 1;
      }
    });

    return Object.values(monthlyRevenue).sort((a, b) => a.month.localeCompare(b.month));
  }, [bookings]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-gray-100">{payload[0].payload.month}</p>
          <p className="text-green-600 dark:text-green-400">
            Revenue: ${payload[0].value.toLocaleString()}
          </p>
          <p className="text-blue-600 dark:text-blue-400">
            Bookings: {payload[0].payload.bookings}
          </p>
        </div>
      );
    }
    return null;
  };

  if (revenueData.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-12">
        No revenue data available
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Revenue Trend
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={revenueData}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="month" 
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke="#8b5cf6" 
            fillOpacity={1} 
            fill="url(#colorRevenue)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
