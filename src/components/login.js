// src/components/LoginPage.js
import React, { useState, useContext } from 'react';
import Layout from './layout';
import { AppContext } from '../context/appcontext';

export default function LoginPage() {
  const { setUser, setCurrentView } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email && password) {
      // For demo, you could replace this with real backend login
      setUser({ id: 1, name: email.split('@')[0], email, provider: 'email' });
      setCurrentView('dashboard');
    } else {
      alert('Please enter email and password');
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-96px)] flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full mb-6 px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Login
          </button>
        </div>
      </div>
    </Layout>
  );
}
