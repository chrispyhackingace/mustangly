import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
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
import GoogleAuthHandler from './components/googleauthhandler';
import ProtectedRoute from './components/ProtectedRoute';
import UnauthorizedRoute from './components/UnauthorizedRoute';

function App() {

  return (
    <Router>
      <AppProvider>
        <Routes>
          {/* Unauthorized route */}
          <Route element={ <UnauthorizedRoute /> }>
            <Route path="/" element={ <Navigate to="/login" /> } />
            <Route path="/login" element={ <Auth /> } />
          </Route>

          {/* Protected routes */}
          <Route element={ <ProtectedRoute /> }>
            <Route path="/login" element={ <Navigate to="/dashboard" /> } />
            <Route path="/" element={ <Navigate to="/dashboard" /> } />
            <Route path="/dashboard" element={ <Dashboard /> } />
            <Route path="/availability" element={ <Availability /> } />
            <Route path="/bookings" element={ <Bookings /> } />
            <Route path="/settings" element={ <Settings /> } />
            <Route path="/confirmation" element={ <Confirmation /> } />
          </Route>

          {/* OAuth routes (public) */}
          <Route path="/auth/google/callback" element={<GoogleAuthHandler />} />
          <Route path="/oauth2callback" element={<OAuthCallback />} />

          {/* Catch-all 404 */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </AppProvider>
    </Router>
  );
}

export default App;
