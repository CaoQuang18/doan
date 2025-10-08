import React, { useContext, memo } from 'react';
import { BiBed, BiBath, BiArea } from 'react-icons/bi';
import { FaArrowRight, FaHeart, FaRegHeart } from 'react-icons/fa';
import { FavoritesContext } from './FavoritesContext';
import { useToast } from './Toast';
import BlurImage from './BlurImage';

const House = memo(({ house }) => {
  const { image, type, country, address, bedrooms, bathrooms, surface, price } = house;
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);
  const { toast } = useToast();
  const houseId = house._id || house.id; // Use MongoDB _id
  const favorite = isFavorite(houseId);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if user is logged in
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      toast.warning('Vui lòng đăng nhập để sử dụng tính năng yêu thích!');
      setTimeout(() => window.location.href = '/login', 1000);
      return;
    }
    
    toggleFavorite({ ...house, id: houseId }); // Ensure id is set
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/50 rounded-2xl w-full max-w-[352px] mx-auto cursor-pointer 
                    overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:hover:shadow-violet-900/50 mt-8 z-10">
      {/* Image Container with Overlay */}
      <div className="relative overflow-hidden h-48">
        <BlurImage
          src={image || 'https://via.placeholder.com/400x300?text=No+Image'}
          alt="house"
          className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
          placeholderClassName="h-48"
          onError={(e) => {
            console.error('Image failed to load:', image);
            e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
          }}
        />
        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-4 right-4 w-10 h-10 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center
                     shadow-lg hover:scale-110 z-30"
        >
          {favorite ? (
            <FaHeart className="text-red-500 text-xl animate-pulse" />
          ) : (
            <FaRegHeart className="text-gray-600 text-xl hover:text-red-500 transition-colors" />
          )}
        </button>
        
        {/* View Details Button */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 
                        transform translate-y-4 group-hover:translate-y-0">
          <button className="bg-white dark:bg-gray-700 text-violet-600 dark:text-violet-400 px-4 py-2 rounded-full font-semibold 
                           flex items-center gap-2 hover:bg-violet-600 hover:text-white dark:hover:bg-violet-600">
            Xem chi tiết
            <FaArrowRight className="text-sm" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Type + Country */}
        <div className="mb-3 flex gap-2 text-xs font-medium">
          <span className="bg-gradient-to-r from-green-500 to-green-600 rounded-full text-white px-3 py-1 
                         shadow-sm hover:shadow-md transition-shadow">
            {type}
          </span>
          <span className="bg-gradient-to-r from-violet-500 to-violet-600 rounded-full text-white px-3 py-1 
                         shadow-sm hover:shadow-md transition-shadow">
            {country}
          </span>
        </div>

        {/* Address */}
        <div className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3 line-clamp-2 
                        group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
          {address}
        </div>

        {/* Info */}
        <div className="flex gap-x-6 mb-4 text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1 text-sm hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
            <BiBed className="text-[20px]" /> 
            <span className="font-medium">{bedrooms}</span>
          </div>
          <div className="flex items-center gap-1 text-sm hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
            <BiBath className="text-[20px]" /> 
            <span className="font-medium">{bathrooms}</span>
          </div>
          <div className="flex items-center gap-1 text-sm hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
            <BiArea className="text-[20px]" /> 
            <span className="font-medium">{surface}</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 
                          bg-clip-text text-transparent">
            ${price.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">/ tháng</div>
        </div>
      </div>
    </div>
  );
});

House.displayName = 'House';

export default House;
