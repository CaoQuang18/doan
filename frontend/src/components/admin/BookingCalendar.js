// components/admin/BookingCalendar.js - Calendar view for bookings
import React, { useState, useMemo } from 'react';
import { FaChevronLeft, FaChevronRight, FaCalendar } from 'react-icons/fa';

const BookingCalendar = ({ bookings, onDateClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);

  // Get bookings for current month
  const monthBookings = useMemo(() => {
    const bookingsByDate = {};
    
    bookings.forEach(booking => {
      const startDate = new Date(booking.startDate);
      if (startDate.getFullYear() === year && startDate.getMonth() === month) {
        const dateKey = startDate.getDate();
        if (!bookingsByDate[dateKey]) {
          bookingsByDate[dateKey] = [];
        }
        bookingsByDate[dateKey].push(booking);
      }
    });

    return bookingsByDate;
  }, [bookings, year, month]);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const today = new Date();
  const isToday = (day) => {
    return day === today.getDate() && 
           month === today.getMonth() && 
           year === today.getFullYear();
  };

  const getBookingColor = (count) => {
    if (count === 0) return 'bg-gray-100 dark:bg-gray-700';
    if (count === 1) return 'bg-green-200 dark:bg-green-900';
    if (count === 2) return 'bg-yellow-200 dark:bg-yellow-900';
    return 'bg-red-200 dark:bg-red-900';
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FaCalendar className="text-violet-600 dark:text-violet-400 text-2xl" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Booking Calendar
          </h3>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <FaChevronLeft className="text-gray-600 dark:text-gray-400" />
          </button>
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-100 min-w-[150px] text-center">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <FaChevronRight className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Week days header */}
        {weekDays.map(day => (
          <div key={day} className="text-center font-semibold text-gray-600 dark:text-gray-400 text-sm py-2">
            {day}
          </div>
        ))}

        {/* Empty cells for days before month starts */}
        {Array.from({ length: startingDayOfWeek }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}

        {/* Days of month */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const bookingCount = monthBookings[day]?.length || 0;
          const isCurrentDay = isToday(day);

          return (
            <button
              key={day}
              onClick={() => onDateClick && onDateClick(new Date(year, month, day), monthBookings[day])}
              className={`
                aspect-square p-2 rounded-lg hover:scale-105
                ${getBookingColor(bookingCount)}
                ${isCurrentDay ? 'ring-2 ring-violet-500 font-bold' : ''}
                hover:shadow-md
              `}
            >
              <div className="text-sm text-gray-900 dark:text-gray-100">{day}</div>
              {bookingCount > 0 && (
                <div className="text-xs font-semibold text-violet-600 dark:text-violet-400 mt-1">
                  {bookingCount}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100 dark:bg-gray-700 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">No bookings</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-200 dark:bg-green-900 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">1 booking</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-200 dark:bg-yellow-900 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">2 bookings</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-200 dark:bg-red-900 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">3+ bookings</span>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;
