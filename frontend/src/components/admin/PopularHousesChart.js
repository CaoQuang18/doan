// components/admin/PopularHousesChart.js - Most booked houses
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const PopularHousesChart = ({ houses, bookings }) => {
  const popularHouses = useMemo(() => {
    const bookingCounts = {};
    
    bookings.forEach(booking => {
      const houseId = booking.house?._id || booking.house?.id;
      if (houseId) {
        bookingCounts[houseId] = (bookingCounts[houseId] || 0) + 1;
      }
    });

    const housesWithBookings = houses
      .map(house => ({
        name: house.name || house.address?.substring(0, 20) + '...',
        bookings: bookingCounts[house._id] || 0,
        price: house.price
      }))
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 10); // Top 10

    return housesWithBookings;
  }, [houses, bookings]);

  const COLORS = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-gray-100">{payload[0].payload.name}</p>
          <p className="text-violet-600 dark:text-violet-400">
            Bookings: {payload[0].value}
          </p>
          <p className="text-green-600 dark:text-green-400">
            Price: ${payload[0].payload.price.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  if (popularHouses.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-12">
        No booking data available
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Most Popular Properties
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={popularHouses} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis type="number" stroke="#9ca3af" style={{ fontSize: '12px' }} />
          <YAxis 
            type="category" 
            dataKey="name" 
            stroke="#9ca3af" 
            style={{ fontSize: '11px' }}
            width={150}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="bookings" radius={[0, 8, 8, 0]}>
            {popularHouses.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PopularHousesChart;
