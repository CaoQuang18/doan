import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../assets/img/logo.svg";
import { FaUser, FaSignOutAlt, FaCog, FaHeart } from "react-icons/fa";
import { FavoritesContext } from "./FavoritesContext";
import { useToast } from "./Toast";
import DarkModeToggle from "./DarkModeToggle";
import { useUser } from "./UserContext";
import NotificationBell from "./NotificationBell";

const Header = () => {
  const { user, logout } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { favoritesCount } = useContext(FavoritesContext);
  const { toast } = useToast();

  // Scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  const handleLogoClick = (e) => {
    // Nếu đang ở trang chủ, scroll lên đầu thay vì reload
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-[9999] backdrop-blur-md transition-all duration-500 ${
      scrolled 
        ? 'bg-gradient-to-r from-violet-600 via-violet-700 to-violet-800 dark:from-gray-800 dark:via-gray-900 dark:to-black shadow-2xl' 
        : 'bg-gradient-to-r from-violet-600/95 via-violet-700/95 to-violet-800/95 dark:from-gray-800/95 dark:via-gray-900/95 dark:to-black/95 shadow-lg'
    } border-b border-white/10 dark:border-gray-700/50`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" onClick={handleLogoClick} className="flex items-center group">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-lg blur-xl group-hover:bg-white/30"></div>
              <img 
                src={Logo} 
                alt="HomeLand" 
                className="h-8 relative z-10 group-hover:scale-110"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>
          </Link>

          {/* Navigation & Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Community Button */}
            <Link
              to="/community"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition text-white font-medium text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Cộng đồng
            </Link>

            {/* Become Host Button */}
            <Link
              to="/become-host"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition text-white font-medium text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Cho thuê nhà
            </Link>

            {/* Dark Mode Toggle */}
            <DarkModeToggle className="hover:bg-white/10 dark:hover:bg-white/5" />
            
            {/* Notification Bell */}
            {user && <NotificationBell />}
            
            {/* Favorites Badge */}
            {user ? (
              <Link to="/favorites" className="relative group" title="Danh sách yêu thích">
                <button className="relative p-3 hover:bg-white/10 rounded-xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 to-red-500/0 group-hover:from-pink-500/20 group-hover:to-red-500/20 rounded-xl"></div>
                  <FaHeart className="text-2xl text-white relative z-10 group-hover:scale-110" />
                  {favoritesCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold 
                                   rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center animate-bounce shadow-lg">
                      {favoritesCount}
                    </span>
                  )}
                </button>
              </Link>
            ) : (
              <button
                onClick={() => {
                  toast.warning('Vui lòng đăng nhập để sử dụng tính năng yêu thích!');
                  setTimeout(() => navigate('/login'), 1000);
                }}
                className="relative p-3 hover:bg-white/10 rounded-xl group"
                title="Đăng nhập để sử dụng"
              >
                <FaHeart className="text-2xl text-white/50 group-hover:text-white/70" />
              </button>
            )}

          {user ? (
            // User is logged in - Beautiful user menu (like in image)
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 px-3 py-2 rounded-2xl 
                         hover:bg-white/10 dark:hover:bg-white/10
                         group"
              >
                {/* User Avatar - Bên trái */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-0.5 shadow-lg">
                    <div className="w-full h-full rounded-full overflow-hidden bg-gray-900">
                      {user.profilePicture ? (
                        <img 
                          src={user.profilePicture} 
                          alt={user.username}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-500 to-purple-600">
                          <FaUser className="text-white text-xl" />
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Online indicator */}
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-gray-800"></div>
                </div>
                
                {/* Greeting - Giữa */}
                <div className="flex flex-col items-start">
                  <span className="text-xs text-gray-400">Chào mừng</span>
                  <span className="font-semibold text-white group-hover:text-violet-300 transition-colors">
                    {user.username}
                  </span>
                </div>
                
                {/* Settings Icon - Răng cưa */}
                <FaCog className="text-gray-400 group-hover:text-white group-hover:rotate-90 ml-2" />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowDropdown(false)}
                  />
                  
                  {/* Dropdown content */}
                  <div className="absolute right-0 mt-2 w-64 
                                bg-white dark:bg-gray-800 
                                rounded-xl shadow-2xl 
                                border border-gray-200 dark:border-gray-700
                                py-2 z-50
                                animate-fadeIn">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-violet-400 to-purple-500">
                          {user.profilePicture ? (
                            <img 
                              src={user.profilePicture} 
                              alt={user.username}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white">
                              <FaUser size={20} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 dark:text-gray-100">{user.username}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        to="/profile"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 
                                 text-gray-700 dark:text-gray-300 
                                 hover:bg-violet-50 dark:hover:bg-gray-700
        "
                      >
                        <FaUser className="text-violet-600 dark:text-violet-400" />
                        <span className="font-medium">Thông tin cá nhân</span>
                      </Link>
                      
                      <Link
                        to="/favorites"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 
                                 text-gray-700 dark:text-gray-300 
                                 hover:bg-violet-50 dark:hover:bg-gray-700
        "
                      >
                        <FaHeart className="text-red-500 dark:text-red-400" />
                        <span className="font-medium">Danh sách yêu thích</span>
                        {favoritesCount > 0 && (
                          <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {favoritesCount}
                          </span>
                        )}
                      </Link>
                    </div>

                    {/* Logout Button */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 
                                 text-red-600 dark:text-red-400 
                                 hover:bg-red-50 dark:hover:bg-red-900/20
                                         w-full text-left font-medium"
                      >
                        <FaSignOutAlt />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            // User is not logged in - Modern buttons
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 sm:px-6 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm text-white font-medium
                         hover:bg-white/20 border border-white/20 hover:border-white/30
                         hover:scale-105 shadow-lg"
              >
                <span className="hidden sm:inline">Đăng nhập</span>
                <span className="sm:hidden">Login</span>
              </Link>
              <Link
                to="/signup"
                className="px-4 sm:px-6 py-2.5 rounded-xl bg-white text-violet-700 font-semibold
                         hover:bg-yellow-300 hover:text-violet-800
                         hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="hidden sm:inline">Đăng ký</span>
                <span className="sm:hidden">Sign up</span>
              </Link>
            </div>
          )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
