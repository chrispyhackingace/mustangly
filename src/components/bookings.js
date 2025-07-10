// src/components/Bookings.js
import React, { useContext, useState, useEffect } from 'react';
import { User, Calendar as CalendarIcon, Clock, Mail, Trash2, Shield, X } from 'lucide-react';
import { AppContext } from '../context/appcontext';
import { supabase } from '../context/appcontext'; // Ensure Supabase client is imported
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
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const { data, error } = await supabase.from('bookings').select('*');
      if (error) {
        addNotification('Failed to fetch bookings', 'error');
      } else {
        setBookedSlots(data);
      }
    };

    const fetchAvailableSlots = async () => {
      const { data, error } = await supabase.from('availability').select('*');
      if (error) {
        addNotification('Failed to fetch available slots', 'error');
      } else {
        setAvailableSlots(data);
      }
    };

    fetchBookings();
    fetchAvailableSlots();
  }, [setBookedSlots, addNotification]);

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

  const handleBooking = async (slot) => {
    const { data, error } = await supabase.from('bookings').insert({
      user_id: user.id,
      slot_id: slot.id,
      clientName: user.name,
      clientEmail: user.email,
      date: slot.date,
      time: slot.time,
      duration: slot.duration
    });

    if (error) {
      addNotification('Failed to create booking', 'error');
    } else {
      addNotification('Booking created successfully', 'success');
      setBookedSlots((prev) => [...prev, data[0]]);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-[calc(100vh-96px)] relative">
        <div className="max-w-6xl w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Available Slots Section */}
          <div className="bg-gradient-to-r from-green-100 via-yellow-100 to-orange-100 rounded-2xl shadow-xl border-2 border-orange-200 p-8 text-center">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent mb-4">
              Available Slots
            </h3>
            <div className="space-y-6">
              {availableSlots.map((slot) => (
                <div key={slot.id} className="bg-white rounded-2xl border-2 border-yellow-200 p-6 hover:border-orange-400 transition-all duration-300 transform hover:scale-102 hover:shadow-lg">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="text-center">
                      <p className="font-bold text-lg text-orange-700 flex items-center justify-center mb-1">
                        {slot.date} - {slot.time}
                      </p>
                      <p className="text-gray-600">Duration: {slot.duration} min</p>
                    </div>
                    <button
                      onClick={() => handleBooking(slot)}
                      className="p-3 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg"
                      title="Book this slot"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}

              {availableSlots.length === 0 && (
                <div className="text-center py-12">
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <h4 className="text-2xl font-bold text-orange-700 mb-2">No available slots</h4>
                    <p className="text-gray-600 text-lg">Check back later for new availability</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Scheduled Meetings Section */}
          <div className="bg-gradient-to-r from-cyan-100 via-blue-100 to-purple-100 rounded-2xl shadow-xl border-2 border-purple-200 p-8 text-center">
            <div className="mb-8">
              <h3 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                Scheduled Meetings
              </h3>
              {bookedSlots.length > 0 && (
                <div className="inline-block bg-white px-6 py-2 rounded-full shadow-md">
                  <span className="text-sm font-semibold text-gray-600">
                    {bookedSlots.length} meeting{bookedSlots.length !== 1 ? 's' : ''} scheduled
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {bookedSlots.map((booking) => (
                <div key={booking.id} className="bg-white rounded-2xl border-2 border-blue-200 p-6 hover:border-purple-400 transition-all duration-300 transform hover:scale-102 hover:shadow-lg">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center shadow-lg">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-xl text-purple-700">{booking.clientName}</p>
                      <p className="text-gray-600 flex items-center justify-center mt-1">
                        <Mail className="w-4 h-4 mr-2" />
                        {booking.clientEmail}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-lg text-purple-700 flex items-center justify-center mb-1">
                        <CalendarIcon className="w-5 h-5 mr-2" />
                        {booking.date}
                      </p>
                      <p className="text-gray-600 flex items-center justify-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {booking.time} ({booking.duration} min)
                      </p>
                    </div>
                    {hostSettings.allowCancellation && (
                      <button
                        onClick={() => handleDeleteInit(booking)}
                        className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg"
                        title="Delete booking"
                      >
                        <Trash2 className="w-6 h-6" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {bookedSlots.length === 0 && (
                <div className="text-center py-12">
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                      <CalendarIcon className="w-12 h-12 text-purple-500" />
                    </div>
                    <h4 className="text-2xl font-bold text-purple-700 mb-2">No bookings scheduled</h4>
                    <p className="text-gray-600 text-lg">Your upcoming meetings will appear here</p>
                  </div>
                </div>
              )}
            </div>
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
    </Layout>
  );
};

export default Bookings;
