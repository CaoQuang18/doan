import React, { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Home,
  CalendarCheck,
  CreditCard,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useDarkMode } from "../components/DarkModeContext";
import Logo from "../assets/img/logo.svg";
import QuickActions from "../components/admin/QuickActions";
import NotificationCenter from "../components/admin/NotificationCenter";
import "../styles/admin-dark-mode.css";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/admin/login");
  };

  const adminName = localStorage.getItem("adminName") || "Admin";

  const menuItems = [
    { path: "/admin", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { path: "/admin/users", label: "Users", icon: <Users size={18} /> },
    { path: "/admin/houses", label: "Houses", icon: <Home size={18} /> },
    { path: "/admin/bookings", label: "Bookings", icon: <CalendarCheck size={18} /> },
    { path: "/admin/payments", label: "Payments", icon: <CreditCard size={18} /> },
  ];

  return (
    <div className="admin-layout flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-violet-600 text-white rounded-xl shadow-lg hover:bg-violet-700 transition-all"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar - Modern & Collapsible */}
      <aside className={`
        ${isCollapsed ? 'w-20' : 'w-72'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        fixed lg:sticky top-0 h-screen
        bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 dark:from-gray-800 dark:via-gray-850 dark:to-gray-900
        text-white shadow-2xl
        transition-all duration-300 ease-in-out
        z-40 flex flex-col
      `}>
        {/* Logo & Toggle */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <img src={Logo} alt="HomeLand" className="h-10 brightness-0 invert flex-shrink-0" />
            {!isCollapsed && (
              <div className="whitespace-nowrap">
                <h2 className="text-xl font-bold">Admin Panel</h2>
                <p className="text-xs text-white/70">HomeLand</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-2 hover:bg-white/10 rounded-lg transition-all"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Admin Info */}
        {!isCollapsed && (
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                {adminName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold">{adminName}</p>
                <p className="text-xs text-white/70">Administrator</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 p-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-white/20 shadow-lg scale-105 font-semibold' 
                    : 'hover:bg-white/10 hover:scale-102'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                  group relative
                `}
                title={isCollapsed ? item.label : ''}
              >
                <div className={`${isActive ? 'text-yellow-300' : 'text-white group-hover:text-yellow-200'} transition-colors`}>
                  {item.icon}
                </div>
                {!isCollapsed && (
                  <span className="whitespace-nowrap">{item.label}</span>
                )}
                {isActive && !isCollapsed && (
                  <div className="absolute right-3 w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`
              w-full flex items-center gap-3 p-3 rounded-xl
              hover:bg-white/10 transition-all
              ${isCollapsed ? 'justify-center' : ''}
            `}
            title={isCollapsed ? (isDarkMode ? "Light Mode" : "Dark Mode") : ''}
          >
            {isDarkMode ? (
              <Sun size={20} className="text-yellow-300" />
            ) : (
              <Moon size={20} className="text-white" />
            )}
            {!isCollapsed && (
              <span className="text-sm">{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
            )}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-3 p-3 rounded-xl
              bg-red-500/20 hover:bg-red-500/30 border border-red-500/30
              transition-all group
              ${isCollapsed ? 'justify-center' : ''}
            `}
            title={isCollapsed ? "Logout" : ''}
          >
            <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className={`
        flex-1 bg-gray-100 dark:bg-gray-900
        ${isCollapsed ? 'lg:ml-0' : 'lg:ml-0'}
      `}>
        {/* Top Header Bar */}
        <header className="bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-900/50 sticky top-0 z-20">
          <div className="flex justify-between items-center p-6">
            <div className="flex items-center gap-4">
              <div className="hidden lg:block w-1 h-8 bg-gradient-to-b from-violet-500 to-purple-600 rounded-full"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {menuItems.find((m) => m.path === location.pathname)?.label || "Admin"}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Manage your {menuItems.find((m) => m.path === location.pathname)?.label.toLowerCase() || "content"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Notification Center */}
              <NotificationCenter />

              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                  {adminName}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>

        {/* Quick Actions FAB */}
        <QuickActions />
      </main>
    </div>
  );
};

export default AdminLayout;
