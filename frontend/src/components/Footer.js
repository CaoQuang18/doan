import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaEnvelope, FaPhone, FaMapMarkerAlt, FaHeart } from 'react-icons/fa';
import Logo from '../assets/img/logo.svg';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return( 
    <footer className='relative bg-gradient-to-br from-gray-900 via-gray-800 to-black dark:from-black dark:via-gray-900 dark:to-black text-white overflow-hidden'>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className='container mx-auto px-4 py-16 relative z-10'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8'>
          {/* About Section */}
          <div>
            <div className="flex items-center mb-4">
              <img 
                src={Logo} 
                alt="HomeLand" 
                className="h-8"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>
            <p className='text-gray-400 mb-4'>
              Nền tảng cho thuê nhà uy tín hàng đầu Việt Nam. 
              Tìm kiếm căn nhà mơ ước của bạn một cách dễ dàng và nhanh chóng.
            </p>
            <div className='flex gap-4'>
              <motion.a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className='w-11 h-11 bg-gradient-to-br from-violet-600 to-purple-600 rounded-full flex items-center justify-center hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-violet-500/50'
              >
                <FaFacebookF className="text-lg" />
              </motion.a>
              <motion.a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className='w-11 h-11 bg-gradient-to-br from-violet-600 to-purple-600 rounded-full flex items-center justify-center hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-violet-500/50'
              >
                <FaTwitter className="text-lg" />
              </motion.a>
              <motion.a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className='w-11 h-11 bg-gradient-to-br from-violet-600 to-purple-600 rounded-full flex items-center justify-center hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-violet-500/50'
              >
                <FaInstagram className="text-lg" />
              </motion.a>
              <motion.a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className='w-11 h-11 bg-gradient-to-br from-violet-600 to-purple-600 rounded-full flex items-center justify-center hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-violet-500/50'
              >
                <FaLinkedinIn className="text-lg" />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='text-lg font-bold mb-4'>Liên kết nhanh</h3>
            <ul className='space-y-2'>
              <li>
                <Link to="/" className='text-gray-400 hover:text-white transition'>
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/" className='text-gray-400 hover:text-white transition'>
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link to="/" className='text-gray-400 hover:text-white transition'>
                  Dịch vụ
                </Link>
              </li>
              <li>
                <Link to="/" className='text-gray-400 hover:text-white transition'>
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className='text-lg font-bold mb-4'>Hỗ trợ</h3>
            <ul className='space-y-2'>
              <li>
                <Link to="/" className='text-gray-400 hover:text-white transition'>
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link to="/" className='text-gray-400 hover:text-white transition'>
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link to="/" className='text-gray-400 hover:text-white transition'>
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link to="/" className='text-gray-400 hover:text-white transition'>
                  Hướng dẫn sử dụng
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className='text-lg font-bold mb-4'>Liên hệ</h3>
            <ul className='space-y-3'>
              <li className='flex items-start gap-3 text-gray-400'>
                <FaMapMarkerAlt className='mt-1 text-violet-500' />
                <span>123 Đường ABC, Quận 1, TP.HCM</span>
              </li>
              <li className='flex items-center gap-3 text-gray-400'>
                <FaPhone className='text-violet-500' />
                <a href="tel:0123456789" className='hover:text-white transition'>
                  0123 456 789
                </a>
              </li>
              <li className='flex items-center gap-3 text-gray-400'>
                <FaEnvelope className='text-violet-500' />
                <a href="mailto:contact@homeland.vn" className='hover:text-white transition'>
                  contact@homeland.vn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='border-t border-gray-700/50 pt-8 mt-8'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <p className='text-gray-400 text-sm'>
              Copyright &copy; {currentYear} <span className="font-semibold text-white">HomeLand</span>. All Rights Reserved
            </p>
            <p className='text-gray-400 text-sm flex items-center gap-2'>
              Made with <FaHeart className="text-red-500 animate-pulse" /> by <span className="font-semibold text-violet-400">Nhóm 6</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
