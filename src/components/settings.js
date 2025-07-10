// src/components/Settings.js
import React, { useContext, useState } from 'react';
import { 
  User, Mail, Shield, Globe, Lock, Check, Clock, RefreshCw, X, Calendar as CalendarIcon 
} from 'lucide-react';
import { AppContext } from '../context/appcontext';
import Layout from './layout'; // Import your layout component

const Settings = () => {
  const { 
    user, 
    setUser,
    timezone, 
    setTimezone,
    hostPassword,
    updateHostPassword,
    hostSettings,
    updateHostSettings,
    addNotification
  } = useContext(AppContext);
  const [profilePic, setProfilePic] = useState(null);
  const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setProfilePic(file);
    addNotification(`Selected file: ${file.name}`, 'success');
  }
};
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [tempSettings, setTempSettings] = useState(hostSettings);

  const timeZones = [
    'America/New York',
    'America/Chicago',
    'America/Denver',
    'America/Los Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Asia/Shanghai'
  ];

  const handleProfileUpdate = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const submitPasswordChange = () => {
    if (passwordForm.new !== passwordForm.confirm) {
      addNotification('New passwords do not match', 'error');
      return;
    }

    if (passwordForm.current !== hostPassword) {
      addNotification('Current password is incorrect', 'error');
      return;
    }

    updateHostPassword(passwordForm.new);
    setPasswordForm({ current: '', new: '', confirm: '' });
    setShowPasswordForm(false);
  };

  const handleSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTempSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : parseInt(value) || value
    }));
  };

  const saveSettings = () => {
    updateHostSettings(tempSettings);
  };

  const generateNewPassword = () => {
    const newPassword = Math.random().toString(36).slice(2, 10);
    updateHostPassword(newPassword);
    setShowPasswordForm(false);
  };

  return (
    <Layout>
      <div className="center-container min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Settings */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Profile Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center border rounded-lg px-3">
                <User className="w-5 h-5 text-gray-500 mr-3" />
                <input
                  type="text"
                  name="name"
                  value={user?.name || ''}
                  onChange={handleProfileUpdate}
                  className="flex-1 py-3 focus:outline-none"
                  placeholder="Full Name"
                />
              </div>
              
              <div className="flex items-center border rounded-lg px-3">
                <Mail className="w-5 h-5 text-gray-500 mr-3" />
                <input
                  type="email"
                  name="email"
                  value={user?.email || ''}
                  onChange={handleProfileUpdate}
                  className="flex-1 py-3 focus:outline-none"
                  placeholder="Email"
                />
              </div>
              
              <div className="flex items-center border rounded-lg px-3">
                <Globe className="w-5 h-5 text-gray-500 mr-3" />
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="flex-1 py-3 focus:outline-none bg-transparent"
                >
                  {timeZones.map(tz => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">

              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="border rounded-lg p-2"
                />
                {profilePic && (
                  <img
                    src={URL.createObjectURL(profilePic)}
                    alt="Profile preview"
                    className="mt-2 w-24 h-24 rounded-full object-cover"
                  />
                )}
              </div>
              </div>

              <div className="pt-4 border-t">
                <button 
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="flex items-center text-purple-600 hover:text-purple-800"
                >
                  <Lock className="w-5 h-5 mr-2" />
                  {showPasswordForm ? 'Hide Password Settings' : 'Change Host Password'}
                </button>
              </div>

              {showPasswordForm && (
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="current"
                      value={passwordForm.current}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="new"
                      value={passwordForm.new}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirm"
                      value={passwordForm.confirm}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={submitPasswordChange}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
                    >
                      <Check className="w-5 h-5 mr-2" />
                      Save Password
                    </button>
                    <button
                      onClick={generateNewPassword}
                      className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 flex items-center"
                    >
                      <RefreshCw className="w-5 h-5 mr-2" />
                      Generate New
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Meeting Settings */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Meeting Settings</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Meeting Duration
                </label>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <select
                    name="meetingDuration"
                    value={tempSettings.meetingDuration}
                    onChange={handleSettingsChange}
                    className="flex-1 px-3 py-2 border rounded-lg"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buffer Time Between Meetings
                </label>
                <div className="flex items-center space-x-3">
                  <RefreshCw className="w-5 h-5 text-gray-500" />
                  <select
                    name="bufferTime"
                    value={tempSettings.bufferTime}
                    onChange={handleSettingsChange}
                    className="flex-1 px-3 py-2 border rounded-lg"
                  >
                    <option value="0">No buffer</option>
                    <option value="5">5 minutes</option>
                    <option value="10">10 minutes</option>
                    <option value="15">15 minutes</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="allowCancellation"
                  name="allowCancellation"
                  checked={tempSettings.allowCancellation}
                  onChange={handleSettingsChange}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <label htmlFor="allowCancellation" className="ml-2 text-sm text-gray-700">
                  Allow guests to cancel meetings
                </label>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setTempSettings(hostSettings)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Reset
                  </button>
                  <button
                    onClick={saveSettings}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
  );
}

export default Settings;