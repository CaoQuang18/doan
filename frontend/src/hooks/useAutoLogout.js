// hooks/useAutoLogout.js - Auto logout after inactivity

import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../components/UserContext';
import { useToast } from '../components/Toast';

/**
 * Auto logout hook - logs out user after period of inactivity
 * @param {number} timeout - Timeout in milliseconds (default: 30 minutes)
 */
export const useAutoLogout = (timeout = 30 * 60 * 1000) => {
  const { user, logout } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Only run if user is logged in
    if (!user) return;

    const resetTimer = () => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        logout();
        toast.warning('Phiên đăng nhập đã hết hạn do không hoạt động');
        navigate('/login');
      }, timeout);
    };

    // Events that reset the timer
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

    // Add event listeners
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Initialize timer
    resetTimer();

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [user, logout, toast, navigate, timeout]);
};

export default useAutoLogout;
