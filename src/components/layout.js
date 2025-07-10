import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Sparkles, User } from 'lucide-react';
import logoImg from '../assets/logo.png'; // Import your logo if needed
import Logout from './logout';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Don't show header on auth pages
  const hideHeader = location.pathname === '/auth' || location.pathname === '/login';
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {!hideHeader && (
        <header className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white shadow-xl relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-indigo-600/20"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12 animate-bounce"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center h-16 space-y-4">
              {/* Logo Section */}
              <div className="flex items-center space-x-4 cursor-pointer" onClick={() => navigate('/dashboard')}>
                <img 
                  src={logoImg} 
                  alt="Mustangly Logo" 
                  style={{ width: '128px', height: '128px', borderRadius: '50%', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', objectFit: 'contain' }}
                />
                <div className="text-center">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-white bg-clip-text text-transparent">
                    mustangly
                  </h1>
                  <span className="hidden sm:block text-sm bg-white/20 px-3 py-1 rounded-full font-medium">
                    🥀 sustang scheduling
                  </span>
                </div>
              </div>

              {/* Navigation */}
              <nav className="center-container flex items-center space-x-6">
                <Logout></Logout>
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