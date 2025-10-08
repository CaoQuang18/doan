import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Image from '../assets/img/house-banner.png';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaUserPlus, FaArrowLeft } from 'react-icons/fa';
import { ImSpinner2 } from 'react-icons/im';
import { useToast } from '../components/Toast';
import { useUser } from '../components/UserContext';
import { motion } from 'framer-motion';

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Password strength calculator
  const getPasswordStrength = (pass) => {
    if (!pass) return { strength: 0, label: '', color: '' };
    let strength = 0;
    if (pass.length >= 6) strength++;
    if (pass.length >= 10) strength++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength++;
    if (/\d/.test(pass)) strength++;
    if (/[^a-zA-Z0-9]/.test(pass)) strength++;

    if (strength <= 2) return { strength: 1, label: 'Yếu', color: 'bg-red-500' };
    if (strength <= 3) return { strength: 2, label: 'Trung bình', color: 'bg-yellow-500' };
    if (strength <= 4) return { strength: 3, label: 'Mạnh', color: 'bg-green-500' };
    return { strength: 4, label: 'Rất mạnh', color: 'bg-green-600' };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Đăng ký thất bại');
      }

      // Tự động đăng nhập sau khi đăng ký thành công
      login(data.user);
      
      setSuccess(true);
      toast.success('Đăng ký thành công! 🎉');
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors duration-500 relative overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      {/* Back Button */}
      <Link
        to="/"
        className="fixed top-20 left-6 flex items-center gap-2 px-4 py-2.5 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-xl hover:bg-white dark:hover:bg-gray-800 text-gray-900 dark:text-white shadow-xl hover:shadow-2xl transition-all duration-300 z-50 group border border-white/20"
      >
        <FaArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-semibold">Trang chủ</span>
      </Link>
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center">
            <ImSpinner2 className="animate-spin text-violet-600 text-6xl mb-4" />
            <p className="text-gray-700 text-lg font-medium">Đang đăng ký...</p>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center max-w-md mx-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Đăng ký thành công!</h3>
            <p className="text-gray-600 text-center">Đang chuyển đến trang chủ...</p>
          </div>
        </div>
      )}

      {/* Bên trái: form */}
      <div className="flex-1 flex items-center justify-center px-6 lg:px-12 py-8 relative z-10 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md bg-white/10 dark:bg-gray-800/30 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 hover:shadow-violet-500/20 transition-shadow duration-300 my-8"
        >
          {/* Icon & Title */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
              className="inline-block p-4 bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 rounded-2xl mb-4 shadow-2xl shadow-violet-500/50"
            >
              <FaUserPlus className="text-4xl text-white" />
            </motion.div>
            <h2 className="text-3xl font-extrabold text-white mb-2">
              Tạo tài khoản
            </h2>
            <p className="text-white/80">Bắt đầu hành trình tìm nhà</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
            {/* Fake fields to prevent autofill */}
            <input type="text" name="fake-user" style={{display: 'none'}} tabIndex="-1" />
            <input type="password" name="fake-pass" style={{display: 'none'}} tabIndex="-1" />
            
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-white/90">Họ và Tên</label>
              <div className="relative group">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-violet-400 transition-colors" />
                <input
                  type="text"
                  name="signup-username"
                  className="w-full pl-10 pr-4 py-3 border-2 border-white/20 rounded-xl 
                           focus:ring-2 focus:ring-violet-400 focus:border-violet-400 
                           bg-white/10 backdrop-blur-sm text-white placeholder-white/40 transition-all duration-300 hover:bg-white/15"
                  placeholder="Nguyễn Văn A"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-white/90">Email</label>
              <div className="relative group">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-violet-400 transition-colors" />
                <input
                  type="text"
                  name="signup-email"
                  autoComplete="off"
                  className="w-full pl-10 pr-4 py-3 border-2 border-white/20 rounded-xl 
                           focus:ring-2 focus:ring-violet-400 focus:border-violet-400 
                           bg-white/10 backdrop-blur-sm text-white placeholder-white/40 transition-all duration-300 hover:bg-white/15"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-white/90">Mật khẩu</label>
              <div className="relative group">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-violet-400 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="signup-password"
                  className="w-full pl-10 pr-12 py-3 border-2 border-white/20 rounded-xl 
                           focus:ring-2 focus:ring-violet-400 focus:border-violet-400 
                           bg-white/10 backdrop-blur-sm text-white placeholder-white/40 transition-all duration-300 hover:bg-white/15"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash size={20}/> : <FaEye size={20}/>}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-all ${
                          level <= passwordStrength.strength
                            ? passwordStrength.color
                            : 'bg-gray-200 dark:bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${
                    passwordStrength.strength === 1 ? 'text-red-600 dark:text-red-400' :
                    passwordStrength.strength === 2 ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-green-600 dark:text-green-400'
                  }`}>
                    Độ mạnh: {passwordStrength.label}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-white/90">Xác nhận mật khẩu</label>
              <div className="relative group">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-violet-400 transition-colors" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="signup-confirm-password"
                  className="w-full pl-10 pr-12 py-3 border-2 border-white/20 rounded-xl 
                           focus:ring-2 focus:ring-violet-400 focus:border-violet-400 
                           bg-white/10 backdrop-blur-sm text-white placeholder-white/40 transition-all duration-300 hover:bg-white/15"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash size={20}/> : <FaEye size={20}/>}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm flex items-start gap-2"
              >
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </motion.div>
            )}

            {/* Terms */}
            <p className="text-xs text-white/70 text-center">
              Bằng việc đăng ký, bạn đồng ý với{' '}
              <Link to="/terms" className="text-white font-semibold hover:underline">
                Điều khoản dịch vụ
              </Link>
              {' '}và{' '}
              <Link to="/privacy" className="text-white font-semibold hover:underline">
                Chính sách bảo mật
              </Link>
            </p>

            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-white to-white/90 text-violet-700 py-3 rounded-xl 
                       hover:shadow-2xl hover:shadow-white/30 transition-all duration-300 
                       font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <ImSpinner2 className="animate-spin" />
                  Đang xử lý...
                </span>
              ) : (
                'Đăng Ký'
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-transparent text-white/70 font-medium">Hoặc tiếp tục với</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <motion.button 
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 px-3 py-2.5 border-2 border-white/20 rounded-xl hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:border-white/40">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-xs font-semibold text-white">Google</span>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 px-3 py-2.5 border-2 border-white/20 rounded-xl hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:border-white/40">
              <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="text-xs font-semibold text-white">Facebook</span>
            </motion.button>
          </div>

          {/* Link đăng nhập */}
          <p className="text-center text-white/80 text-sm">
            Đã có tài khoản?{' '}
            <Link
              to="/login"
              className="text-white font-bold hover:underline underline-offset-4 decoration-2 transition-all"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </motion.div>
      </div>
      <div className="hidden lg:flex flex-1 justify-center items-center p-8">
        <div className="relative">
          <img 
            src={Image} 
            alt="banner" 
            className="w-full h-full object-cover rounded-3xl shadow-2xl" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-3xl"></div>
          <div className="absolute bottom-8 left-8 text-white">
            <h3 className="text-3xl font-bold mb-2">Gia nhập cộng đồng</h3>
            <p className="text-lg opacity-90">Hơn 1000+ người dùng tin tưởng</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
