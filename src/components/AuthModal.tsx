import React, { useState } from 'react';
import Button from './Button';
import {Base} from '../Backend/BaseUrl';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isFlipping, setIsFlipping] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New loading state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true); // Start loading

    const endpoint = isLogin ? 'auth/login' : 'auth/register';
    const body = isLogin
      ? { email, password }
      : { email, password, username };

    try {
      const response = await fetch(`${Base}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      onSuccess();
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setIsLoading(false); // Stop loading regardless of success/error
    }
  };

  const handleToggle = () => {
    if (isLoading) return; // Prevent toggle while loading
    setIsFlipping(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setIsFlipping(false);
    }, 150);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50"></div>
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-xl w-full max-w-md">
          {/* Close Button */}
          <button
            onClick={onClose}
            disabled={isLoading} // Disable while loading
            className="absolute top-3 left-3 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 disabled:opacity-50"
          >
            close
          </button>

          {/* Toggle Button Group */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-200 dark:bg-gray-700 rounded-full p-1 flex shadow-lg">
            <button
              onClick={() => !isLogin && handleToggle()}
              disabled={isLoading} // Disable while loading
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                !isLogin
                  ? 'bg-transparent text-gray-600 dark:text-gray-300'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Login
            </button>
            <button
              onClick={() => isLogin && handleToggle()}
              disabled={isLoading} // Disable while loading
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isLogin
                  ? 'bg-transparent text-gray-600 dark:text-gray-300'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Sign Up
            </button>
          </div>

          <div className={`transition-transform duration-300 ${isFlipping ? 'scale-x-0' : 'scale-x-100'}`}>
            <div className="p-6 pt-12">
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full p-3 text-gray-900 dark:text-white rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
                      placeholder="Enter your username"
                      required
                      disabled={isLoading} // Disable while loading
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 text-gray-900 dark:text-white rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
                    placeholder="Enter your email"
                    required
                    disabled={isLoading} // Disable while loading
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 text-gray-900 dark:text-white rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
                    placeholder="Enter your password"
                    required
                    disabled={isLoading} // Disable while loading
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full flex justify-center items-center"
                  disabled={isLoading} // Disable while loading
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isLogin ? 'Logging in...' : 'Signing up...'}
                    </>
                  ) : (
                    isLogin ? 'Login' : 'Sign Up'
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}