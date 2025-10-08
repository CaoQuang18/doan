import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaHome, FaUsers, FaCheckCircle } from 'react-icons/fa';
import Image from '../assets/img/house-banner.png';
import Search from '../components/Search';

function Banner() {
  return (
    <section className="min-h-[100vh] pb-32 bg-gradient-to-b from-violet-700 via-violet-600 to-violet-800 text-white transition-colors duration-700 relative">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl"
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"
          animate={{ y: [0, -40, 0], x: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Nội dung */}
      <div className="flex flex-col lg:flex-row h-full relative z-10">
        {/* Bên trái: chữ */}
        <div className="lg:ml-8 xl:ml-[135px] flex flex-col items-center lg:items-start 
                        text-center lg:text-left justify-center flex-1 px-4 lg:px-0 pt-20 lg:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl lg:text-[58px] font-bold leading-tight mb-6">
              <motion.span 
                className="text-yellow-300 inline-block"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Thuê
              </motion.span> Căn Nhà Mơ Ước Của Bạn.
            </h1>
          </motion.div>

          <motion.p 
            className="max-w-[480px] mb-8 text-gray-100 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Tìm kiếm và thuê căn nhà hoàn hảo với hàng ngàn lựa chọn 
            từ khắp nơi. Quy trình đơn giản, nhanh chóng và an toàn 
            với đội ngũ hỗ trợ 24/7.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <Link
              to="/#properties"
              className="group px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <FaHome />
              Xem nhà ngay
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/signup"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <FaUsers />
              Đăng ký ngay
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="flex flex-wrap gap-8 justify-center lg:justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-yellow-300 text-2xl" />
              <div>
                <p className="text-3xl font-bold">1000+</p>
                <p className="text-sm text-gray-200">Căn nhà</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-yellow-300 text-2xl" />
              <div>
                <p className="text-3xl font-bold">500+</p>
                <p className="text-sm text-gray-200">Khách hàng</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-yellow-300 text-2xl" />
              <div>
                <p className="text-3xl font-bold">24/7</p>
                <p className="text-sm text-gray-200">Hỗ trợ</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bên phải: hình với animation */}
        <div className="hidden flex-1 lg:flex justify-end items-center relative">
          <motion.img
            src={Image}
            alt="banner"
            className="rounded-tl-[80px] shadow-2xl mb-10"
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 0.95, x: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
            whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
          />
        </div>
      </div>

      {/* Thanh search - Ở cuối banner với spacing đẹp */}
      <div className="relative z-50 -mb-16">
        <Search />
      </div>
    </section>
  );
}

export default Banner;
