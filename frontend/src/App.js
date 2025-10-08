// src/App.js
import React, { useEffect, useRef, Suspense, lazy } from "react";
import { Routes, Route, useLocation, useNavigationType } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

// Components (Always loaded)
import Header from "./components/Header";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import { FavoritesProvider } from "./components/FavoritesContext";
import { ToastProvider } from "./components/Toast";
import { DarkModeProvider } from "./components/DarkModeContext";
import { UserProvider } from "./components/UserContext";
import HouseContextProvider from "./components/HouseContext";
import { NotificationProvider } from "./components/NotificationContext";

// Lazy loaded components
const ChatbotAI = lazy(() => import("./components/ChatbotAI"));

// Pages (Lazy loaded)
const Home = lazy(() => import("./pages/Home"));
const PropertyDetails = lazy(() => import("./pages/PropertyDetails"));
const Payment = lazy(() => import("./pages/Payment"));
const BecomeHost = lazy(() => import("./pages/BecomeHost"));
const Community = lazy(() => import("./pages/Community"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/Signup"));
const Profile = lazy(() => import("./pages/Profile"));
const Favorites = lazy(() => import("./pages/Favorites"));
const TestAPI = lazy(() => import("./pages/TestAPI"));

// Admin (Lazy loaded)
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Users = lazy(() => import("./pages/admin/Users"));
const Houses = lazy(() => import("./pages/admin/Houses"));
const Bookings = lazy(() => import("./pages/admin/Bookings"));
const Payments = lazy(() => import("./pages/admin/Payments"));
const AdminLogin = lazy(() => import("./pages/admin/login"));
const PrivateAdminRoute = lazy(() => import("./routes/PrivateAdminRoute"));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-violet-700 via-violet-600 to-violet-800 dark:from-gray-900 dark:via-gray-800 dark:to-black">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
      <p className="mt-4 text-white text-lg font-medium">Đang tải...</p>
    </div>
  </div>
);

const pageVariants = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 },
};

const App = () => {
  const location = useLocation();
  const navType = useNavigationType(); // "POP" (back/forward), "PUSH" (new), "REPLACE"
  const scrollPositions = useRef({}); // lưu scroll theo pathname

  // ✅ Tắt auto scroll mặc định của trình duyệt
  useEffect(() => {
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = "auto";
    };
  }, []);

  // ✅ Lưu scroll trước khi đổi trang
  useEffect(() => {
    const handleBeforeUnload = () => {
      scrollPositions.current[location.pathname] = window.scrollY;
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [location.pathname]);

  // ✅ Khôi phục scroll khi back/forward, hoặc lên top khi route mới
  useEffect(() => {
    if (navType === "POP") {
      // back/forward
      const savedY = scrollPositions.current[location.pathname] ?? 0;
      window.scrollTo(0, savedY);
    } else {
      // chuyển route mới
      window.scrollTo(0, 0);
    }
  }, [location.pathname, navType]);

  const userRoutes = [
    { path: "/", element: <Home /> },
    { path: "/test-api", element: <TestAPI /> },
    { path: "/property/:id", element: <PropertyDetails /> },
    { path: "/payment", element: <Payment /> },
    { path: "/become-host", element: <BecomeHost /> },
    { path: "/community", element: <Community /> },
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <SignUp /> },
    { path: "/profile", element: <Profile /> },
    { path: "/favorites", element: <Favorites /> },
  ];

  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <ErrorBoundary>
      <DarkModeProvider>
        <ToastProvider>
          <UserProvider>
            <NotificationProvider>
              <HouseContextProvider>
                <FavoritesProvider>
              <div
              className={`w-full min-h-screen transition-colors duration-300 ${
                isAdminPage
                  ? "bg-white dark:bg-gray-900 text-black dark:text-white"
                  : "bg-gradient-to-b from-violet-700 via-violet-600 to-violet-800 dark:from-gray-900 dark:via-gray-800 dark:to-black text-white"
              }`}
            >
            {/* Header chỉ hiện với user */}
            {!isAdminPage && <Header />}

          {/* Animate route transitions with Suspense */}
          <Suspense fallback={<LoadingSpinner />}>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
              {userRoutes.map(({ path, element }) => (
                <Route
                  key={path}
                  path={path}
                  element={
                    <motion.div
                      variants={pageVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="p-4 sm:p-6 md:p-8"
                    >
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6">
                        {element}
                      </div>
                    </motion.div>
                  }
                />
              ))}

              <Route path="/admin/login" element={<AdminLogin />} />

              <Route
                path="/admin"
                element={
                  <PrivateAdminRoute>
                    <AdminLayout />
                  </PrivateAdminRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="houses" element={<Houses />} />
                <Route path="bookings" element={<Bookings />} />
                <Route path="payments" element={<Payments />} />
              </Route>
            </Routes>
          </AnimatePresence>
          </Suspense>

            {/* Footer chỉ hiện với user */}
            {!isAdminPage && <Footer />}
          </div>
          
          {/* Chatbot OUTSIDE container - để fixed position hoạt động */}
          {!isAdminPage && (
            <Suspense fallback={null}>
              <ChatbotAI />
            </Suspense>
          )}
                </FavoritesProvider>
              </HouseContextProvider>
            </NotificationProvider>
          </UserProvider>
        </ToastProvider>
      </DarkModeProvider>
    </ErrorBoundary>
  );
};

export default App;
