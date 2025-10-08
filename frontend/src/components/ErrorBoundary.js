import React from 'react';
import { FaExclamationTriangle, FaRedo } from 'react-icons/fa';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600 dark:from-gray-900 dark:via-gray-800 dark:to-black p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
            {/* Icon */}
            <div className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <FaExclamationTriangle className="text-4xl text-red-600 dark:text-red-400" />
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Oops! Something went wrong
            </h1>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We're sorry for the inconvenience. The application encountered an unexpected error.
            </p>

            {/* Error Details (Development only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                  Show error details
                </summary>
                <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-auto max-h-40">
                  <pre className="text-xs text-red-600 dark:text-red-400">
                    {this.state.error.toString()}
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </pre>
                </div>
              </details>
            )}

            {/* Actions */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors duration-200"
              >
                <FaRedo />
                <span>Refresh Page</span>
              </button>
              
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors duration-200"
              >
                <span>Go Home</span>
              </button>
            </div>

            {/* Help Text */}
            <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              If this problem persists, please contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
