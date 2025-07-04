// src/App.js
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, AppContext } from './context/appcontext';
import Auth from './components/auth';
import Dashboard from './components/dashboard';
import Availability from './components/availability';
import Bookings from './components/bookings';
import Settings from './components/settings';
import Confirmation from './components/confirmation';
import ErrorPage from './components/errorpage';
import Layout from './components/layout';
import OAuthCallback from './components/oauthcallback';

function PrivateRoute({ children }) {
  const { user } = useContext(AppContext);
  return user ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <Router>
      <AppProvider>
        <Routes>
          {/* Public route */}
          <Route path="/" element={<Auth />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/availability"
            element={
              <PrivateRoute>
                <Layout>
                  <Availability />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <PrivateRoute>
                <Layout>
                  <Bookings />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Layout>
                  <Settings />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/confirmation"
            element={
              <PrivateRoute>
                <Layout>
                  <Confirmation />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* OAuth callback route (public) */}
          <Route path="/oauth2callback" element={<OAuthCallback />} />

          {/* Catch-all 404 */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </AppProvider>
    </Router>
  );
}

export default App;
