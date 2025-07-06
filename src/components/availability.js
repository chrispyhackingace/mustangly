import React, { useContext, useState, useEffect } from 'react';
import { Clock, Check, X } from 'lucide-react';
import { AppContext } from '../context/appcontext';
import Layout from './layout';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const Availability = () => {
  const { availabilitySlots, timezone, setTimezone, saveAvailability, addNotification } = useContext(AppContext);

  const [localSlots, setLocalSlots] = useState([]);
  const [saving, setSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    setLocalSlots(availabilitySlots);
  }, [availabilitySlots]);

  // Email validation helper
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Update slot field locally
  const handleSlotChange = (id, changes) => {
    setLocalSlots(prev =>
      prev.map(slot => (slot.id === id ? { ...slot, ...changes } : slot))
    );
  };

  // Save handler with email validation (if you have email in slots)
  const handleSave = async () => {
    // Example: If slots have email, validate all emails first
    for (const slot of localSlots) {
      if (slot.email && !isValidEmail(slot.email)) {
        addNotification(`Invalid email in ${slot.day}: ${slot.email}`, 'error');
        return;
      }
    }

    setSaving(true);
    try {
      await saveAvailability(localSlots);
      addNotification('Availability saved successfully', 'success');
    } catch (err) {
      addNotification('Failed to save availability', 'error');
    } finally {
      setSaving(false);
    }
  };

  const timeZones = [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Asia/Shanghai'
  ];

  return (
    <Layout>
      <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-[calc(100vh-96px)] relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="bg-gradient-to-r from-cyan-100 via-blue-100 to-purple-100 rounded-2xl shadow-xl border-2 border-purple-200 p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Weekly Availability</h3>
              <div className="bg-white px-4 py-2 rounded-full shadow-md">
                <span className="text-sm font-semibold text-gray-600">Edit Your Schedule</span>
              </div>
            </div>

            <div className="space-y-6">
              {localSlots.map(slot => (
                <div key={slot.id} className="flex items-center justify-between p-6 border-2 border-blue-200 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all duration-300 transform hover:scale-102 hover:shadow-lg">
                  <div className="flex items-center space-x-6">
                    <div className="w-28 font-bold text-lg text-purple-700 bg-white px-3 py-1 rounded-lg shadow-sm">{slot.day}</div>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <input
                          type="time"
                          value={slot.startTime}
                          disabled={saving}
                          onChange={e => handleSlotChange(slot.id, { startTime: e.target.value })}
                          className="border-2 border-purple-300 rounded-lg px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 bg-white shadow-sm"
                        />
                        <Clock className="absolute top-3 right-3 text-purple-400 w-4 h-4" />
                      </div>
                      <span className="text-purple-600 font-bold text-lg">to</span>
                      <div className="relative">
                        <input
                          type="time"
                          value={slot.endTime}
                          disabled={saving}
                          onChange={e => handleSlotChange(slot.id, { endTime: e.target.value })}
                          className="border-2 border-purple-300 rounded-lg px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 bg-white shadow-sm"
                        />
                        <Clock className="absolute top-3 right-3 text-purple-400 w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      disabled={saving}
                      onClick={() => handleSlotChange(slot.id, { active: !slot.active })}
                      className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg ${slot.active ? 'bg-gradient-to-r from-green-400 to-green-600 text-white hover:from-green-500 hover:to-green-700' : 'bg-gradient-to-r from-red-400 to-red-600 text-white hover:from-red-500 hover:to-red-700'}`}
                      aria-label={slot.active ? 'Deactivate slot' : 'Activate slot'}
                    >
                      {slot.active ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100 rounded-2xl shadow-xl border-2 border-pink-200 p-8 text-center">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-6">Select Date & Time</h3>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <DatePicker
                selected={selectedDate}
                onChange={date => setSelectedDate(date)}
                showTimeSelect
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                className="border-2 border-purple-300 rounded-lg p-4 w-full max-w-sm mx-auto shadow-md focus:ring-4 focus:ring-purple-200 focus:border-purple-500 font-semibold"
                placeholderText="Select date and time"
                popperPlacement="bottom"
              />
            </div>

            <div className="mt-8 max-w-sm mx-auto">
              <label htmlFor="timezone-select" className="block mb-3 font-bold text-lg text-purple-700">
                Select Timezone
              </label>
              <select
                id="timezone-select"
                value={timezone}
                onChange={e => setTimezone(e.target.value)}
                className="border-2 border-purple-300 rounded-lg px-4 py-3 w-full shadow-lg focus:ring-4 focus:ring-purple-200 focus:border-purple-500 font-semibold bg-white"
              >
                {timeZones.map(tz => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>

            <div className="mt-10">
              <button
                onClick={handleSave}
                disabled={saving}
                className={`px-8 py-4 rounded-2xl text-white font-bold text-lg shadow-xl transition-all duration-300 transform hover:scale-105 ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 hover:shadow-2xl'}`}
                title="Save your availability changes"
              >
                {saving ? 'Saving...' : '💾 Save Availability'}
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-100 via-emerald-100 to-teal-100 rounded-2xl shadow-xl border-2 border-green-200 p-8">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-6">✨ Your Active Availability</h3>
            {localSlots.filter(slot => slot.active && slot.startTime && slot.endTime).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {localSlots.filter(slot => slot.active && slot.startTime && slot.endTime).map(slot => (
                  <div key={slot.id} className="bg-white p-6 border-2 border-green-300 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-xl font-bold text-lg shadow-md">
                        {slot.day}
                      </div>
                      <div className="text-lg font-semibold text-gray-700 bg-green-50 px-4 py-2 rounded-lg">
                        {slot.startTime} - {slot.endTime}
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        ✅ Available
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <div className="text-6xl mb-4">📅</div>
                  <p className="text-xl font-semibold text-gray-600 mb-2">No active availability set</p>
                  <p className="text-gray-500">Set your time slots above and activate them to see them here!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Availability;
