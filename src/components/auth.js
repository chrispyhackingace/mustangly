import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Shield, User, Mail, Eye, EyeOff, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { AppContext } from '../context/appcontext';
import Layout from './layout';
import { supabase } from '../supabase-client';

const Auth = () => {
  const [authMode, setAuthMode] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const popupRef = useRef(null);

  // Check if user is already authenticated
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        navigate('/dashboard');
      }
    };
    checkUser();
  }, [navigate]);

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setSuccess('Login successful! Redirecting...');
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
        }
        
        if (event === 'SIGNED_OUT') {
          navigate('/auth');
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, [navigate]);

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (email, type) => {
    if (type === 'login') {
      setLoginData({ ...loginData, email });
    } else {
      setSignupData({ ...signupData, email });
    }
    setEmailValid(validateEmail(email));
    setEmailTouched(true);
    setError(''); // Clear errors when user types
    setSuccess('');
  };

  const handleGoogleLogin = async () => {
    try {
      setLoadingGoogle(true);
      setError('');

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        console.error('Google login error:', error.message);
        setError(error.message);
        setLoadingGoogle(false);
        return;
      }

      const userEmail = data?.user?.email;
      if (!userEmail.endsWith('@mustangmath.com')) {
        setError('Only @mustangmath.com emails are allowed.');
        await supabase.auth.signOut();
        setLoadingGoogle(false);
        return;
      }

      // Note: For OAuth, the redirect happens automatically
    } catch (err) {
      console.error('Google login error:', err);
      setError('Failed to login with Google. Please try again.');
      setLoadingGoogle(false);
    }
  };

  const handleUsernameLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password
      });

      if (error) {
        console.error('Login error:', error.message);
        
        // Provide user-friendly error messages
        let errorMessage = error.message;
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Please check your email and click the confirmation link before signing in.';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Too many login attempts. Please wait a moment and try again.';
        }
        
        setError(errorMessage);
        setLoading(false);
        return;
      }

      if (data.user) {
        setSuccess('Login successful! Redirecting to dashboard...');
        // The auth state change listener will handle the redirect
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          data: {
            name: signupData.name,
            full_name: signupData.name
          }
        }
      });

      if (error) {
        console.error('Signup error:', error.message);
        
        // Provide user-friendly error messages
        let errorMessage = error.message;
        if (error.message.includes('User already registered')) {
          errorMessage = 'An account with this email already exists. Please try logging in instead.';
        } else if (error.message.includes('Password should be')) {
          errorMessage = 'Password must be at least 6 characters long.';
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'Please enter a valid email address.';
        }
        
        setError(errorMessage);
        setLoading(false);
        return;
      }

      if (data.user) {
        if (data.user.email_confirmed_at) {
          // User is immediately confirmed (e.g., in development)
          setSuccess('Account created successfully! Redirecting...');
          // The auth state change listener will handle the redirect
        } else {
          // User needs to confirm email
          setSuccess('Account created! Please check your email for a confirmation link.');
          setLoading(false);
        }
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const currentEmail = authMode === 'login' ? loginData.email : signupData.email;
  const isFormValid = authMode === 'login' 
    ? emailValid && loginData.password 
    : emailValid && signupData.password && signupData.name;

  return (
    <Layout>
      <div className="center-container bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full opacity-10 animate-spin" style={{animationDuration: '20s'}}></div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/20 relative z-10 flex flex-col items-center transform hover:scale-[1.02] transition-all duration-300">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-full mb-4 animate-pulse shadow-lg relative">
              <Calendar className="w-12 h-12 text-white" />
              <Sparkles className="w-5 h-5 text-yellow-300 absolute -top-1 -right-1 animate-bounce" />
            </div>
            <h1 className="main-heading">
              Mustangly
            </h1>
            <p className="main-subheading">Smart scheduling for sustangs</p>
          </div> 

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-300 text-red-700 text-center font-medium animate-fadeIn">
              <AlertCircle className="w-4 h-4 inline mr-2" />
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 rounded-lg bg-green-100 border border-green-300 text-green-700 text-center font-medium animate-fadeIn">
              <CheckCircle className="w-4 h-4 inline mr-2" />
              {success}
            </div>
          )}

          <div className="space-y-6 w-full">

            <div className="border-t pt-6">
              <div className="flex bg-gradient-to-r from-gray-100 to-gray-50 rounded-2xl p-1.5 mb-6 shadow-inner">
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setError('');
                    setSuccess('');
                  }}
                  className={`flex-1 py-3 px-4 rounded-xl transition-all duration-300 font-semibold ${
                    authMode === 'login' 
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg transform scale-105' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  🔑 Login
                </button>
                <button
                  onClick={() => {
                    setAuthMode('signup');
                    setError('');
                    setSuccess('');
                  }}
                  className={`flex-1 py-3 px-4 rounded-xl transition-all duration-300 font-semibold ${
                    authMode === 'signup' 
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg transform scale-105' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  ✨ Sign Up
                </button>
              </div>

              {authMode === 'login' ? (
                <form onSubmit={handleUsernameLogin} className="space-y-5">
                  <div className="relative ml-4">
                    <div className={`flex items-center border-2 rounded-2xl px-4 py-1 transition-all duration-300 ${
                      emailTouched && currentEmail 
                        ? emailValid 
                          ? 'border-green-400 bg-green-50' 
                          : 'border-red-400 bg-red-50'
                        : 'border-gray-200 bg-white hover:border-purple-300 focus-within:border-purple-500'
                    }`}>
                      <Mail className={`w-5 h-5 mr-3 transition-colors duration-300 ${
                        emailTouched && currentEmail 
                          ? emailValid ? 'text-green-500' : 'text-red-500'
                          : 'text-gray-400'
                      }`} />
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={loginData.email}
                        onChange={(e) => handleEmailChange(e.target.value, 'login')}
                        className="flex-1 py-3 focus:outline-none bg-transparent font-medium placeholder-gray-400"
                        required
                        disabled={loading || loadingGoogle}
                      />
                      {emailTouched && currentEmail && (
                        emailValid ? (
                          <CheckCircle className="w-5 h-5 text-green-500 animate-pulse" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-500 animate-pulse" />
                        )
                      )}
                    </div>
                    {emailTouched && currentEmail && !emailValid && (
                      <p className="text-red-500 text-sm mt-1 flex items-center animate-fadeIn">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        Please enter a valid email address
                      </p>
                    )}
                  </div>

                  <div className="relative ml-4">
                    <div className="flex items-center border-2 border-gray-200 rounded-2xl px-4 py-1 hover:border-purple-300 focus-within:border-purple-500 transition-all duration-300 bg-white">
                      <Shield className="w-5 h-5 text-gray-400 mr-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className="flex-1 py-3 focus:outline-none bg-transparent font-medium placeholder-gray-400"
                        required
                        disabled={loading || loadingGoogle}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        disabled={loading || loadingGoogle}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      type="submit"
                      disabled={!isFormValid || loading || loadingGoogle}
                      className={`flex-1 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform ${
                        isFormValid && !loading && !loadingGoogle
                          ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white hover:from-purple-600 hover:via-pink-600 hover:to-indigo-600 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Signing In...
                        </span>
                      ) : (
                        '🚀 Sign In'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={loadingGoogle || loading}
                      className="flex-1 py-4 bg-white border-2 border-gray-300 rounded-xl flex items-center justify-center hover:border-purple-300 hover:shadow-lg transition-all duration-300 disabled:opacity-50 group transform hover:scale-[1.02]"
                    >
                      {loadingGoogle ? (
                        <span className="flex items-center">
                          <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                          Connecting...
                        </span>
                      ) : (
                        <span className="flex items-center font-semibold text-gray-700">
                          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                          Login with Google
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSignup} className="space-y-5">
                  <div className="flex items-center border-2 border-gray-200 rounded-2xl px-4 py-1 hover:border-purple-300 focus-within:border-purple-500 transition-all duration-300 bg-white">
                    <User className="w-5 h-5 text-gray-400 mr-3" />
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={signupData.name}
                      onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                      className="flex-1 py-3 focus:outline-none bg-transparent font-medium placeholder-gray-400"
                      required
                      disabled={loading || loadingGoogle}
                    />
                  </div>

                  <div className="relative">
                    <div className={`flex items-center border-2 rounded-2xl px-4 py-1 transition-all duration-300 ${
                      emailTouched && currentEmail 
                        ? emailValid 
                          ? 'border-green-400 bg-green-50' 
                          : 'border-red-400 bg-red-50'
                        : 'border-gray-200 bg-white hover:border-purple-300 focus-within:border-purple-500'
                    }`}>
                      <Mail className={`w-5 h-5 mr-3 transition-colors duration-300 ${
                        emailTouched && currentEmail 
                          ? emailValid ? 'text-green-500' : 'text-red-500'
                          : 'text-gray-400'
                      }`} />
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={signupData.email}
                        onChange={(e) => handleEmailChange(e.target.value, 'signup')}
                        className="flex-1 py-3 focus:outline-none bg-transparent font-medium placeholder-gray-400"
                        required
                        disabled={loading || loadingGoogle}
                      />
                      {emailTouched && currentEmail && (
                        emailValid ? (
                          <CheckCircle className="w-5 h-5 text-green-500 animate-pulse" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-500 animate-pulse" />
                        )
                      )}
                    </div>
                    {emailTouched && currentEmail && !emailValid && (
                      <p className="text-red-500 text-sm mt-1 flex items-center animate-fadeIn">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        Please enter a valid email address
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <div className="flex items-center border-2 border-gray-200 rounded-2xl px-4 py-1 hover:border-purple-300 focus-within:border-purple-500 transition-all duration-300 bg-white">
                      <Shield className="w-5 h-5 text-gray-400 mr-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a strong password (min 6 characters)"
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        className="flex-1 py-3 focus:outline-none bg-transparent font-medium placeholder-gray-400"
                        required
                        minLength={6}
                        disabled={loading || loadingGoogle}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        disabled={loading || loadingGoogle}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      type="submit"
                      disabled={!isFormValid || loading || loadingGoogle}
                      className={`flex-1 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform ${
                        isFormValid && !loading && !loadingGoogle
                          ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Creating Account...
                        </span>
                      ) : (
                        '🎉 Create Account'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={loadingGoogle || loading}
                      className="flex-1 py-4 bg-white border-2 border-gray-300 rounded-xl flex items-center justify-center hover:border-purple-300 hover:shadow-lg transition-all duration-300 disabled:opacity-50 group transform hover:scale-[1.02]"
                    >
                      {loadingGoogle ? (
                        <span className="flex items-center">
                          <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                          Connecting...
                        </span>
                      ) : (
                        <span className="flex items-center font-semibold text-gray-700">
                          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                          Login with Google
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              By continuing, you agree to our{' '}
              <a href="#" className="text-purple-600 hover:underline font-medium">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-purple-600 hover:underline font-medium">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;