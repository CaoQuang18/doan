import React, { useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FavoritesContext } from '../components/FavoritesContext';
import { BiBed, BiBath, BiArea } from 'react-icons/bi';
import { FaHeart, FaTrash } from 'react-icons/fa';

const Favorites = () => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite, clearFavorites } = useContext(FavoritesContext);

  // Check if user is logged in
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      alert('Vui lòng đăng nhập để xem danh sách yêu thích!');
      navigate('/login');
    }
  }, [navigate]);

  const handleRemoveFavorite = (house) => {
    if (window.confirm(`Bạn có chắc muốn xóa "${house.name}" khỏi danh sách yêu thích?`)) {
      toggleFavorite(house);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Bạn có chắc muốn xóa tất cả yêu thích?')) {
      clearFavorites();
    }
  };

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-600 via-violet-600 to-purple-700 dark:from-gray-900 dark:via-gray-800 dark:to-black pt-32 pb-12 transition-colors duration-500">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-12 text-center transition-colors duration-300">
            <div className="mb-6">
              <FaHeart className="text-gray-300 text-8xl mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Danh sách yêu thích trống
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Bạn chưa có căn nhà nào trong danh sách yêu thích. 
                Hãy khám phá và thêm những căn nhà bạn thích!
              </p>
              <Link
                to="/"
                className="inline-block bg-gradient-to-r from-violet-600 to-purple-600 text-white 
                         px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Khám phá ngay
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-600 via-violet-600 to-purple-700 dark:from-gray-900 dark:via-gray-800 dark:to-black pt-32 pb-12 transition-colors duration-500">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <FaHeart className="text-red-500" />
                Danh sách yêu thích
              </h1>
              <p className="text-white/80">
                Bạn có {favorites.length} căn nhà yêu thích
              </p>
            </div>
            {favorites.length > 0 && (
              <button
                onClick={handleClearAll}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg 
                         font-semibold transition flex items-center gap-2"
              >
                <FaTrash />
                Xóa tất cả
              </button>
            )}
          </div>
        </div>

        {/* Favorites Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((house) => (
            <div
              key={house.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/50 overflow-hidden hover:shadow-2xl dark:hover:shadow-violet-900/50 
                        hover:-translate-y-2"
            >
              {/* Image */}
              <div className="relative">
                <Link to={`/property/${house._id || house.id}`}>
                  <img
                    src={house.image}
                    alt={house.name}
                    className="w-full h-48 object-cover hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </Link>
                
                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveFavorite(house)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white dark:bg-gray-700 rounded-full 
                           flex items-center justify-center shadow-lg hover:scale-110 transition-all"
                >
                  <FaHeart className="text-red-500 text-xl" />
                </button>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Type & Country */}
                <div className="flex gap-2 mb-3">
                  <span className="bg-gradient-to-r from-green-500 to-green-600 text-white 
                                 px-3 py-1 rounded-full text-xs font-medium">
                    {house.type}
                  </span>
                  <span className="bg-gradient-to-r from-violet-500 to-violet-600 text-white 
                                 px-3 py-1 rounded-full text-xs font-medium">
                    {house.country}
                  </span>
                </div>

                {/* Name */}
                <Link to={`/property/${house._id || house.id}`}>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 hover:text-violet-600 dark:hover:text-violet-400 
                               transition line-clamp-1">
                    {house.name}
                  </h3>
                </Link>

                {/* Address */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {house.address}
                </p>

                {/* Info */}
                <div className="flex gap-4 mb-4 text-gray-600 dark:text-gray-400 text-sm">
                  <div className="flex items-center gap-1">
                    <BiBed className="text-lg" />
                    <span>{house.bedrooms}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BiBath className="text-lg" />
                    <span>{house.bathrooms}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BiArea className="text-lg" />
                    <span>{house.surface}</span>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 
                                bg-clip-text text-transparent">
                    ${house.price?.toLocaleString() || house.price}
                  </div>
                  <Link
                    to={`/property/${house._id || house.id}`}
                    className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 
                             rounded-lg text-sm font-semibold transition"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Back to Home */}
        <div className="max-w-6xl mx-auto mt-8 text-center">
          <Link
            to="/"
            className="inline-block bg-white/10 backdrop-blur-md text-white px-8 py-3 
                     rounded-lg font-semibold hover:bg-white/20 transition"
          >
            ← Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Favorites;
