import { useContext, useState, useEffect } from 'react';
import { Clock, Check, X } from 'lucide-react';
import { AppContext } from '../context/appcontext';
import Layout from './layout';
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Weekly Availability Section */}
          <div className="bg-gradient-to-r from-cyan-100 via-blue-100 to-purple-100 rounded-2xl shadow-xl border-2 border-purple-200 p-8">
            <div className="text-center mb-8">
              <h3 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">Weekly Availability</h3>
              <div className="inline-block bg-white px-6 py-2 rounded-full shadow-md">
                <span className="text-sm font-semibold text-gray-600">Edit Your Schedule</span>
              </div>
            </div>

            {/* Days Grid - Horizontal Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {localSlots.map(slot => (
                <div key={slot.id} className="bg-white rounded-2xl border-2 border-blue-200 p-6 hover:border-purple-400 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                  <div className="text-center mb-4">
                    <div className="font-bold text-lg text-purple-700 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-lg shadow-sm">
                      {slot.day}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Start Time</label>
                      <input
                        type="time"
                        value={slot.startTime}
                        disabled={saving}
                        onChange={e => handleSlotChange(slot.id, { startTime: e.target.value })}
                        className="w-full border-2 border-purple-300 rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 bg-white shadow-sm"
                      />
                      <Clock className="absolute top-7 right-3 text-purple-400 w-4 h-4" />
                    </div>
                    
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-600 mb-1">End Time</label>
                      <input
                        type="time"
                        value={slot.endTime}
                        disabled={saving}
                        onChange={e => handleSlotChange(slot.id, { endTime: e.target.value })}
                        className="w-full border-2 border-purple-300 rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 bg-white shadow-sm"
                      />
                      <Clock className="absolute top-7 right-3 text-purple-400 w-4 h-4" />
                    </div>
                    
                    <div className="text-center pt-2">
                      <button
                        disabled={saving}
                        onClick={() => handleSlotChange(slot.id, { active: !slot.active })}
                        className={`px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg font-medium text-sm ${slot.active ? 'bg-gradient-to-r from-green-400 to-green-600 text-white hover:from-green-500 hover:to-green-700' : 'bg-gradient-to-r from-red-400 to-red-600 text-white hover:from-red-500 hover:to-red-700'}`}
                        aria-label={slot.active ? 'Deactivate slot' : 'Activate slot'}
                      >
                        {slot.active ? (
                          <>
                            <Check className="w-4 h-4 inline mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <X className="w-4 h-4 inline mr-1" />
                            Inactive
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Save Button */}
            <div className="text-center">
              <button
                onClick={handleSave}
                disabled={saving}
                className={`px-8 py-4 rounded-2xl text-white font-bold text-lg shadow-xl transition-all duration-300 transform hover:scale-105 ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 hover:shadow-2xl'}`}
                title="Save your availability changes"
              >
                {saving ? (
                  <span className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Saving...
                  </span>
                ) : (
                  '💾 Save Availability'
                )}
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-100 via-emerald-100 to-teal-100 rounded-2xl shadow-xl border-2 border-green-200 p-8">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-6">Current Availability</h3>
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
                        Available
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
