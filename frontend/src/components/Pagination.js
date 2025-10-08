// components/Pagination.js - Modern pagination component
import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, totalItems }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 px-4">
      {/* Items info */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing <span className="font-semibold text-gray-900 dark:text-gray-100">{startItem}</span> to{' '}
        <span className="font-semibold text-gray-900 dark:text-gray-100">{endItem}</span> of{' '}
        <span className="font-semibold text-gray-900 dark:text-gray-100">{totalItems}</span> properties
      </div>

      {/* Pagination buttons */}
      <div className="flex items-center gap-2">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg transition-all ${
            currentPage === 1
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
              : 'bg-white dark:bg-gray-700 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-gray-600 shadow-md hover:shadow-lg'
          }`}
        >
          <FaChevronLeft />
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            className={`min-w-[40px] h-10 rounded-lg font-medium transition-all ${
              page === currentPage
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg scale-110'
                : page === '...'
                ? 'bg-transparent text-gray-400 cursor-default'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-gray-600 shadow-md hover:shadow-lg'
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg transition-all ${
            currentPage === totalPages
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
              : 'bg-white dark:bg-gray-700 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-gray-600 shadow-md hover:shadow-lg'
          }`}
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
