// components/Breadcrumbs.js - Navigation breadcrumbs
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaChevronRight } from 'react-icons/fa';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const getBreadcrumbName = (path) => {
    const names = {
      'property': 'Properties',
      'favorites': 'Favorites',
      'profile': 'Profile',
      'login': 'Login',
      'signup': 'Sign Up',
      'admin': 'Admin',
      'users': 'Users',
      'houses': 'Houses',
      'bookings': 'Bookings'
    };
    return names[path] || path;
  };

  if (pathnames.length === 0) return null;

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-3 px-4 transition-colors">
      <div className="container mx-auto">
        <ol className="flex items-center gap-2 text-sm">
          {/* Home */}
          <li>
            <Link 
              to="/" 
              className="flex items-center gap-1 text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
            >
              <FaHome />
              <span>Home</span>
            </Link>
          </li>

          {/* Path segments */}
          {pathnames.map((path, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;

            return (
              <React.Fragment key={routeTo}>
                <FaChevronRight className="text-gray-400 dark:text-gray-600 text-xs" />
                <li>
                  {isLast ? (
                    <span className="text-gray-700 dark:text-gray-300 font-semibold">
                      {getBreadcrumbName(path)}
                    </span>
                  ) : (
                    <Link
                      to={routeTo}
                      className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                    >
                      {getBreadcrumbName(path)}
                    </Link>
                  )}
                </li>
              </React.Fragment>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;
