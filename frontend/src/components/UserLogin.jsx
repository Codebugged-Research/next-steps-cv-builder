import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
// import { useAuth } from '../contexts/AuthContext';

const LoginPage = ({ onShowRegister }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
//   const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(userId, password);
      if (!success) {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#04445E] to-[#169AB4] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <img
              src="/NEXT-STEPS-LOGO.png"
              alt="Next Steps Logo"
              className="h-16 mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-[#04445E] mb-2">
              Login to Your USMLE CV Portal
            </h1>
            <p className="text-gray-600 text-sm">
              Create professional Medical CV
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative">
                <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
                  User ID / Email
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    id="userId"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#169AB4] focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email or user ID"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#169AB4] focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#04445E] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#033a4d] focus:ring-2 focus:ring-[#169AB4] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Login'}
            </button>

            <div className="text-center space-y-3">
              <button
                type="button"
                onClick={onShowRegister}
                className="text-[#169AB4] hover:text-[#04445E] font-medium transition-colors duration-200"
              >
                New Registration
              </button>
              <div>
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-700 text-sm transition-colors duration-200"
                >
                  Forgot Password?
                </button>
              </div>
            </div>
          </form>
        </div>

        <footer className="text-center mt-8 text-white/80 text-sm">
          <p>© Next Steps 2025 | Contact Us | Terms & Conditions | Privacy Policy</p>
        </footer>
      </div>
    </div>
  );
};

export default LoginPage;
