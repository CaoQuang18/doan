import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shield, User, Lock, ArrowLeft, Eye, EyeOff, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useDarkMode } from "../../components/DarkModeContext";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Đăng nhập thất bại");
      }

      // Lưu thông tin admin
      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("adminUser", JSON.stringify(data.user));
      
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 dark:from-gray-900 dark:via-gray-800 dark:to-black p-4">
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 p-3 bg-white/10 dark:bg-gray-800/50 backdrop-blur-md rounded-full hover:bg-white/20 dark:hover:bg-gray-700/50 shadow-lg"
        title={isDarkMode ? "Light Mode" : "Dark Mode"}
      >
        {isDarkMode ? (
          <Sun size={24} className="text-yellow-300" />
        ) : (
          <Moon size={24} className="text-white" />
        )}
      </button>

      {/* Back Button */}
      <Link
        to="/"
        className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-white/10 dark:bg-gray-800/50 backdrop-blur-md rounded-full hover:bg-white/20 dark:hover:bg-gray-700/50 text-white shadow-lg"
      >
        <ArrowLeft size={20} />
        <span className="hidden sm:inline">Trang chủ</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <form
          onSubmit={handleLogin}
          className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50"
        >
          {/* Header with Icon */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-500 rounded-full mb-4 shadow-lg"
            >
              <Shield size={32} className="text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Admin Portal
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Đăng nhập để quản lý hệ thống
            </p>
          </div>
          
          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2"
            >
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-red-700 dark:text-red-400">{error}</span>
            </motion.div>
          )}
          
          {/* Fake fields to prevent autofill */}
          <input type="text" name="prevent-autofill-user" style={{display: 'none'}} tabIndex="-1" />
          <input type="password" name="prevent-autofill-pass" style={{display: 'none'}} tabIndex="-1" />
          
          {/* Username Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tên đăng nhập
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={20} className="text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                name="admin-username"
                placeholder=""
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={(e) => e.target.removeAttribute('readonly')}
                required
                autoComplete="off"
                readOnly
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={20} className="text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="admin-password"
                placeholder=""
                className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={(e) => e.target.removeAttribute('readonly')}
                required
                autoComplete="new-password"
                readOnly
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 dark:from-purple-500 dark:to-indigo-500 dark:hover:from-purple-600 dark:hover:to-indigo-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Đang xử lý...</span>
              </>
            ) : (
              <>
                <Shield size={20} />
                <span>Đăng nhập</span>
              </>
            )}
          </motion.button>

          {/* Info */}
          <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <p className="text-xs text-purple-700 dark:text-purple-300 text-center">
              🔐 <strong>Demo:</strong> Username: <code className="bg-purple-100 dark:bg-purple-800 px-2 py-0.5 rounded">admin</code> | Password: <code className="bg-purple-100 dark:bg-purple-800 px-2 py-0.5 rounded">123</code>
            </p>
          </div>
        </form>

        {/* Footer */}
        <p className="text-center mt-6 text-white/80 dark:text-gray-400 text-sm">
          © 2025 HomeLand Admin. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
