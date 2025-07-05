// src/components/LoginPage.js
import React, { useState, useContext } from 'react';
import Layout from './layout';
import { AppContext } from '../context/appcontext';

export default function LoginPage() {
  const { setUser, setCurrentView } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle email input change with real-time validation
  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    
    if (emailValue === '') {
      setEmailError('');
      setIsValidEmail(false);
    } else if (validateEmail(emailValue)) {
      setEmailError('');
      setIsValidEmail(true);
    } else {
      setEmailError('Please enter a valid email address');
      setIsValidEmail(false);
    }
  };

  const handleLogin = () => {
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }
    
    if (!isValidEmail) {
      alert('Please enter a valid email address');
      return;
    }
    
    // For demo, you could replace this with real backend login
    setUser({ id: 1, name: email.split('@')[0], email, provider: 'email' });
    setCurrentView('dashboard');
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-96px)] flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none transition-colors ${
                email === '' 
                  ? 'border-gray-300 focus:border-indigo-500' 
                  : isValidEmail 
                    ? 'border-green-500 focus:border-green-500' 
                    : 'border-red-500 focus:border-red-500'
              }`}
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <span className="mr-1">⚠️</span>
                {emailError}
              </p>
            )}
            {isValidEmail && email && (
              <p className="text-green-500 text-sm mt-1 flex items-center">
                <span className="mr-1">✅</span>
                Valid email address
              </p>
            )}
          </div>
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full mb-6 px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
          />
          
          <button
            onClick={handleLogin}
            disabled={!isValidEmail || !password}
            className={`w-full py-3 rounded-lg transition ${
              isValidEmail && password
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Login
          </button>
        </div>
      </div>
    </Layout>
  );
}
