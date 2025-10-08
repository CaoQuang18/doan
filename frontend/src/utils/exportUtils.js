// utils/exportUtils.js - Export data to CSV, PDF, Excel
/**
 * Convert array of objects to CSV
 * @param {Array} data - Array of objects
 * @param {String} filename - Output filename
 */
export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export houses data
 * @param {Array} houses - Houses array
 */
export const exportHouses = (houses) => {
  const exportData = houses.map(house => ({
    Name: house.name,
    Type: house.type,
    Country: house.country,
    Address: house.address,
    Bedrooms: house.bedrooms,
    Bathrooms: house.bathrooms,
    Surface: house.surface,
    Price: house.price,
    Status: house.status,
    Year: house.year
  }));

  exportToCSV(exportData, `houses_${new Date().toISOString().split('T')[0]}.csv`);
};

/**
 * Export bookings data
 * @param {Array} bookings - Bookings array
 */
export const exportBookings = (bookings) => {
  const exportData = bookings.map(booking => ({
    'Booking ID': booking._id,
    'House Name': booking.house?.name || 'N/A',
    'User': booking.user?.username || booking.user?.email || 'N/A',
    'Start Date': new Date(booking.startDate).toLocaleDateString(),
    'End Date': new Date(booking.endDate).toLocaleDateString(),
    'Status': booking.status,
    'Price': booking.house?.price || 0,
    'Created': new Date(booking.createdAt).toLocaleDateString()
  }));

  exportToCSV(exportData, `bookings_${new Date().toISOString().split('T')[0]}.csv`);
};

/**
 * Export users data
 * @param {Array} users - Users array
 */
export const exportUsers = (users) => {
  const exportData = users.map(user => ({
    Username: user.username,
    Email: user.email,
    Role: user.role,
    Address: user.address || 'N/A',
    'Date of Birth': user.dateOfBirth || 'N/A',
    'Created': new Date(user.createdAt).toLocaleDateString()
  }));

  exportToCSV(exportData, `users_${new Date().toISOString().split('T')[0]}.csv`);
};

/**
 * Generate analytics report
 * @param {Object} analytics - Analytics data
 */
export const exportAnalyticsReport = (analytics) => {
  const reportData = [
    { Metric: 'Total Users', Value: analytics.totalUsers },
    { Metric: 'Total Houses', Value: analytics.totalHouses },
    { Metric: 'Total Bookings', Value: analytics.totalBookings },
    { Metric: 'Total Revenue', Value: `$${analytics.totalRevenue.toLocaleString()}` },
    { Metric: 'Pending Bookings', Value: analytics.pendingBookings },
    { Metric: 'Available Houses', Value: analytics.availableHouses },
    { Metric: 'Report Date', Value: new Date().toLocaleString() }
  ];

  exportToCSV(reportData, `analytics_report_${new Date().toISOString().split('T')[0]}.csv`);
};

export default {
  exportToCSV,
  exportHouses,
  exportBookings,
  exportUsers,
  exportAnalyticsReport
};
