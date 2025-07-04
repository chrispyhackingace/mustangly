// src/components/Confirmation.js
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, User, Mail, Copy } from 'lucide-react';
import { AppContext } from '../context/appcontext';
import Layout from './layout';

const Confirmation = () => {
  const { guestInfo, selectedDate, selectedTime, bookedSlots } = useContext(AppContext);
  const navigate = useNavigate();
  const latestBooking = bookedSlots[bookedSlots.length - 1];

  const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const copyToClipboard = () => {
    const bookingDetails = `
      Name: ${guestInfo.name}
      Email: ${guestInfo.email}
      Date: ${formattedDate}
      Time: ${selectedTime}
      Duration: 30 minutes
    `;
    navigator.clipboard.writeText(bookingDetails.trim());
    alert('Booking details copied to clipboard!');
  };

  return (
    <Layout> {/* ✅ Wrap with Layout */}
      <div className="bg-gray-50 min-h-[calc(100vh-96px)] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-md">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
            <p className="text-white/90">Your meeting has been successfully scheduled</p>
          </div>

          {/* Booking Details */}
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-purple-100 p-2 rounded-lg mr-4">
                  <User className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{guestInfo.name}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-lg mr-4">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{guestInfo.email}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-lg mr-4">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{formattedDate}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-orange-100 p-2 rounded-lg mr-4">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium">{selectedTime} (30 minutes)</p>
                </div>
              </div>
            </div>

            {/* Confirmation Number */}
            {latestBooking && (
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Confirmation #</p>
                <div className="flex justify-between items-center">
                  <p className="font-mono font-bold text-purple-600">{latestBooking.id}</p>
                  <button 
                    onClick={copyToClipboard}
                    className="text-gray-500 hover:text-purple-600 transition-colors"
                    title="Copy details"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>A confirmation email has been sent to {guestInfo.email}</p>
              <p className="mt-1">Add this event to your calendar</p>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 pb-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition-colors mb-3"
            >
              Return to Dashboard
            </button>
            <button
              onClick={() => navigate('/bookings')}
              className="w-full bg-white border border-purple-600 text-purple-600 hover:bg-purple-50 py-3 rounded-lg transition-colors"
            >
              View All Bookings
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Confirmation;
