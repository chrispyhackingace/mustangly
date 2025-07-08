import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Mail, Settings, Plus } from 'lucide-react';
import { AppContext } from '../context/appcontext';
import Logout from './logout';

const Dashboard = () => {
  const { user, bookedSlots, availabilitySlots, timezone } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-96px)] bg-gray-50">
        <Logout></Logout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Stats Cards */}
            <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-800">{bookedSlots.length}</p>
                </div>
                <Calendar className="w-12 h-12 text-purple-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Available Days</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {availabilitySlots.filter(s => s.active).length}/5
                  </p>
                </div>
                <Clock className="w-12 h-12 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Current Timezone</p>
                  <p className="text-xl font-bold text-gray-800">
                    {timezone.split('/')[1] || timezone}
                  </p>
                </div>
                <Settings className="w-12 h-12 text-blue-500" />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="col-span-full bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button 
                  onClick={() => navigate('/availability')}
                  className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-purple-50 hover:border-purple-200 transition-colors"
                >
                  <Plus className="w-6 h-6 text-purple-600 mb-2" />
                  <span>Add Availability</span>
                </button>
                <button 
                  onClick={() => navigate('/bookings')}
                  className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors"
                >
                  <Calendar className="w-6 h-6 text-blue-600 mb-2" />
                  <span>View Bookings</span>
                </button>
                <button 
                  onClick={() => navigate('/settings')}
                  className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-green-50 hover:border-green-200 transition-colors"
                >
                  <Settings className="w-6 h-6 text-green-600 mb-2" />
                  <span>Settings</span>
                </button>
                <button 
                  className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-orange-50 hover:border-orange-200 transition-colors"
                >
                  <User className="w-6 h-6 text-orange-600 mb-2" />
                  <span>My Profile</span>
                </button>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="col-span-full bg-white rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Recent Bookings</h3>
                <button 
                  onClick={() => navigate('/bookings')}
                  className="text-sm text-purple-600 hover:text-purple-800"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {bookedSlots.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{booking.clientName}</p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          {booking.clientEmail}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-800">{booking.date}</p>
                      <p className="text-sm text-gray-600">{booking.time} ({booking.duration}min)</p>
                    </div>
                  </div>
                ))}
                {bookedSlots.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No bookings yet. Schedule your first meeting!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

  );
};

export default Dashboard;
