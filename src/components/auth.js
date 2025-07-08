import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Shield, User, Mail } from 'lucide-react';
import { AppContext } from '../context/appcontext';
import Layout from './layout';
import { supabase } from '../supabase-client';

const Auth = () => {
  const [authMode, setAuthMode] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const navigate = useNavigate();
  const popupRef = useRef(null);

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    setLoadingGoogle(true);
  };

  const handleUsernameLogin = async (e) => {
    e.preventDefault();
    
    const {error} = await supabase.auth.signInWithPassword({email: loginData.email, password: loginData.password});
    if (error) {
      console.error('Signup error:', error.message);
      return;
    } else {
      navigate('/dashboard');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const {error} = await supabase.auth.signUp({email: signupData.email, password: signupData.password});
    if (error) {
      console.error('Signup error:', error.message);
      return;
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <Layout>
      <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4 min-h-[calc(100vh-96px)]">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Mustangly</h1>
            <p className="text-gray-600">Smart scheduling made simple</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              disabled={loadingGoogle}
              className="w-full bg-white border-2 border-gray-200 rounded-xl px-6 py-3 flex items-center justify-center hover:border-gray-300 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                {/* Google icon paths here */}
              </svg>
              {loadingGoogle ? 'Logging in with Google...' : 'Continue with Google'}
            </button>

            <div className="border-t pt-4">
              <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
                <button
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-2 px-4 rounded-lg transition-all ${
                    authMode === 'login' ? 'bg-white shadow-sm' : 'text-gray-600'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setAuthMode('signup')}
                  className={`flex-1 py-2 px-4 rounded-lg transition-all ${
                    authMode === 'signup' ? 'bg-white shadow-sm' : 'text-gray-600'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {authMode === 'login' ? (
                <div className="space-y-4">
                  <div className="flex items-center border rounded-lg px-3">
                    <Mail className="w-5 h-5 text-gray-500 mr-2" />
                    <input
                      type="email"
                      placeholder="Email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="flex-1 py-3 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center border rounded-lg px-3">
                    <Shield className="w-5 h-5 text-gray-500 mr-2" />
                    <input
                      type="password"
                      placeholder="Password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="flex-1 py-3 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={handleUsernameLogin}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl px-6 py-3 hover:from-purple-600 hover:to-blue-600 transition-all"
                  >
                    Sign In
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center border rounded-lg px-3">
                    <User className="w-5 h-5 text-gray-500 mr-2" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={signupData.name}
                      onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                      className="flex-1 py-3 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center border rounded-lg px-3">
                    <Mail className="w-5 h-5 text-gray-500 mr-2" />
                    <input
                      type="email"
                      placeholder="Email"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      className="flex-1 py-3 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center border rounded-lg px-3">
                    <Shield className="w-5 h-5 text-gray-500 mr-2" />
                    <input
                      type="password"
                      placeholder="Password"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      className="flex-1 py-3 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={handleSignup}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl px-6 py-3 hover:from-purple-600 hover:to-blue-600 transition-all"
                  >
                    Create Account
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;