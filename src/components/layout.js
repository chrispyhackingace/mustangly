import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Sparkles, User, LogOut } from 'lucide-react';
import logoImg from '../assets/logo.png'; // Import your logo if needed

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Don't show header on auth pages
  const hideHeader = location.pathname === '/auth' || location.pathname === '/login';
  
  const handleLogout = () => {
    // Add logout logic here
    navigate('/auth');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {!hideHeader && (
        <header className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white shadow-xl relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-indigo-600/20"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12 animate-bounce"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo Section */}
              <div className="flex items-center space-x-4 cursor-pointer" onClick={() => navigate('/dashboard')}>
                <div className="relative">
                  <img 
                    src={logoImg} 
                    alt="Mustangly Logo" 
                    className="w-10 h-10 rounded-full shadow-lg object-contain"
                  />
                  <Sparkles className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-white bg-clip-text text-transparent">
                  Mustangly
                </h1>
                <span className="hidden sm:block text-sm bg-white/20 px-3 py-1 rounded-full font-medium">
                    🥀 Sustang scheduling
                </span>
              </div>
              
              {/* Navigation */}
              <nav className="hidden md:flex items-center space-x-6">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 font-medium"
                >
                  📊 Dashboard
                </button>
                <button 
                  onClick={() => navigate('/availability')}
                  className="px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 font-medium"
                >
                  📅 Availability
                </button>
                <button 
                  onClick={() => navigate('/bookings')}
                  className="px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 font-medium"
                >
                  🤝 Bookings
                </button>
              </nav>
              
              {/* User Menu */}
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium">Welcome back!</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 group"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 group-hover:text-red-300 transition-colors duration-200" />
                </button>
              </div>
            </div>
          </div>
        </header>
      )}
      
      <main className="relative z-0">
        {children}
      </main>
    </div>
  );
};

export default Layout;