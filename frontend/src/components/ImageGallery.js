import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaTimes, FaExpand, FaPause, FaPlay } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';

const ImageGallery = ({ images, houseName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [direction, setDirection] = useState(0);

  // Ensure we have at least one image
  const imageList = images && images.length > 0 ? images : [images];

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (imageList.length <= 1 || !isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % imageList.length);
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [imageList.length, isAutoPlay]);

  const nextImage = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % imageList.length);
  };

  const prevImage = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  // Smooth fade animation like e-commerce sites
  const variants = {
    enter: {
      opacity: 0,
      scale: 1.05,
    },
    center: {
      opacity: 1,
      scale: 1,
    },
    exit: {
      opacity: 0,
      scale: 0.95,
    },
  };

  return (
    <div className="relative">
      {/* Main Image */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900 group h-[400px] md:h-[500px] lg:h-[600px]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.img
            key={currentIndex}
            src={imageList[currentIndex]}
            alt={`${houseName} - ${currentIndex + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              opacity: { duration: 0.6, ease: "easeInOut" },
              scale: { duration: 0.8, ease: "easeOut" },
            }}
          />
        </AnimatePresence>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Navigation Arrows */}
        {imageList.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center
                       opacity-0 group-hover:opacity-100 hover:scale-110 shadow-lg z-10"
            >
              <FaChevronLeft className="text-gray-800 dark:text-white text-xl" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center
                       opacity-0 group-hover:opacity-100 hover:scale-110 shadow-lg z-10"
            >
              <FaChevronRight className="text-gray-800 dark:text-white text-xl" />
            </button>
          </>
        )}

        {/* Top Right Controls */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 z-10">
          {/* Play/Pause Button */}
          {imageList.length > 1 && (
            <button
              onClick={toggleAutoPlay}
              className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-lg"
              title={isAutoPlay ? "Pause auto-slide" : "Play auto-slide"}
            >
              {isAutoPlay ? (
                <FaPause className="text-gray-800 dark:text-white text-sm" />
              ) : (
                <FaPlay className="text-gray-800 dark:text-white text-sm ml-0.5" />
              )}
            </button>
          )}
          
          {/* Fullscreen Button */}
          <button
            onClick={() => setIsFullscreen(true)}
            className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-lg"
            title="Fullscreen"
          >
            <FaExpand className="text-gray-800 dark:text-white" />
          </button>
        </div>

        {/* Image Counter with Progress Bar */}
        {imageList.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            {/* Progress Bar */}
            {isAutoPlay && (
              <div className="w-32 h-1 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 5, ease: 'linear' }}
                  key={currentIndex}
                />
              </div>
            )}
            {/* Counter */}
            <div className="bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
              {currentIndex + 1} / {imageList.length}
            </div>
          </div>
        )}
      </div>

      {/* Thumbnail Navigation with Animations */}
      {imageList.length > 1 && (
        <div className="mt-4 grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {imageList.map((image, index) => (
            <motion.button
              key={index}
              onClick={() => goToImage(index)}
              className={`relative rounded-lg overflow-hidden aspect-square group/thumb ${
                index === currentIndex
                  ? 'ring-4 ring-violet-500 shadow-lg shadow-violet-500/50'
                  : 'ring-2 ring-gray-300 dark:ring-gray-700 hover:ring-violet-400'
              }`}
              whileHover={{ scale: 1.1, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {index !== currentIndex && (
                <div className="absolute inset-0 bg-black/40 group-hover/thumb:bg-black/20 transition-colors" />
              )}
              {/* Active indicator */}
              {index === currentIndex && (
                <motion.div
                  className="absolute inset-0 border-2 border-white rounded-lg"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal - Simple version without zoom */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
          {/* Close Button */}
          <button
            onClick={closeFullscreen}
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all z-10"
          >
            <FaTimes className="text-white text-2xl" />
          </button>

          {/* Navigation in Fullscreen */}
          {imageList.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all"
              >
                <FaChevronLeft className="text-white text-2xl" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all"
              >
                <FaChevronRight className="text-white text-2xl" />
              </button>
            </>
          )}

          {/* Fullscreen Image */}
          <img
            src={imageList[currentIndex]}
            alt={`${houseName} - Fullscreen`}
            className="max-w-full max-h-[90vh] object-contain"
          />

          {/* Counter in Fullscreen */}
          {imageList.length > 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-full text-lg font-medium">
              {currentIndex + 1} / {imageList.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
