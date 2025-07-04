// src/components/Bookings.js
import React, { useContext, useState } from 'react';
import { User, Calendar as CalendarIcon, Clock, Mail, Trash2, Shield, X } from 'lucide-react';
import { AppContext } from '../context/appcontext';
import Layout from './layout'; // ✅ Import Layout

const Bookings = () => {
  const {
    user,
    bookedSlots,
    setBookedSlots,
    addNotification,
    verifyHost,
    hostSettings
  } = useContext(AppContext);

  const [deleteModal, setDeleteModal] = useState({
    show: false,
    booking: null,
    credentials: { name: '', password: '' }
  });

  const handleDeleteInit = (booking) => {
    setDeleteModal({
      show: true,
      booking,
      credentials: { name: '', password: '' }
    });
  };

  const handleDeleteConfirm = () => {
    if (!verifyHost(deleteModal.credentials.name, deleteModal.credentials.password)) {
      addNotification('Invalid host credentials', 'error');
      return;
    }

    setBookedSlots(prev => prev.filter(b => b.id !== deleteModal.booking.id));
    addNotification('Booking deleted successfully', 'success');
    setDeleteModal({
      show: false,
      booking: null,
      credentials: { name: '', password: '' }
    });
  };

  const handleCredentialChange = (e) => {
    const { name, value } = e.target;
    setDeleteModal(prev => ({
      ...prev,
      credentials: {
        ...prev.credentials,
        [name]: value
      }
    }));
  };

  return (
    <Layout>
      <div className="bg-gray-50 min-h-[calc(100vh-96px)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Scheduled Meetings
              {bookedSlots.length > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({bookedSlots.length} total)
                </span>
              )}
            </h3>

            <div className="space-y-4">
              {bookedSlots.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-purple-600" />
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
                    <p className="font-medium text-gray-800 flex items-center">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      {booking.date}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {booking.time} ({booking.duration} minutes)
                    </p>
                  </div>
                  {hostSettings.allowCancellation && (
                    <button
                      onClick={() => handleDeleteInit(booking)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                      title="Delete booking"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}

              {bookedSlots.length === 0 && (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <CalendarIcon className="w-10 h-10 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-600">No bookings scheduled</h4>
                  <p className="text-gray-500 mt-1">Your upcoming meetings will appear here</p>
                </div>
              )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModal.show && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Confirm Deletion</h3>
                    <button
                      onClick={() => setDeleteModal(prev => ({ ...prev, show: false }))}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <p className="text-gray-600 mb-6">
                    You are about to delete the booking for <strong>{deleteModal.booking.clientName}</strong> on <strong>{deleteModal.booking.date}</strong> at <strong>{deleteModal.booking.time}</strong>.
                  </p>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={deleteModal.credentials.name}
                        onChange={handleCredentialChange}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="Enter your host name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Host Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={deleteModal.credentials.password}
                        onChange={handleCredentialChange}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="Enter host password"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setDeleteModal(prev => ({ ...prev, show: false }))}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteConfirm}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                    >
                      <Shield className="w-5 h-5 mr-2" />
                      Confirm Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Bookings;
