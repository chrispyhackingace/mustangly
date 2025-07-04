// src/components/Availability.js
import React, { useContext, useState, useEffect } from 'react';
import { Clock, Check, X } from 'lucide-react';
import { AppContext } from '../context/appcontext';
import Layout from './layout';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const Availability = () => {
  const { availabilitySlots, updateAvailability, timezone, setTimezone, saveAvailability, addNotification } = useContext(AppContext);

  // Local state copy of slots to edit
  const [localSlots, setLocalSlots] = useState([]);
  const [saving, setSaving] = useState(false);

  // Calendar state (optional, as before)
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    // Copy slots from context on mount or when availabilitySlots change
    setLocalSlots(availabilitySlots);
  }, [availabilitySlots]);

  // Handler for local slot changes
  const handleSlotChange = (id, changes) => {
    setLocalSlots(prevSlots =>
      prevSlots.map(slot => (slot.id === id ? { ...slot, ...changes } : slot))
    );
  };

  // Save button handler
  const handleSave = async () => {
    setSaving(true);
    try {
      await saveAvailability(localSlots); // assume this is async
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
      <div className="bg-gray-50 min-h-[calc(100vh-96px)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Weekly Availability */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Weekly Availability</h3>
            </div>

            <div className="space-y-4">
              {localSlots.map((slot) => (
                <div key={slot.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-24 font-medium text-gray-700">{slot.day}</div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="time"
                        value={slot.startTime}
                        disabled={saving}
                        onChange={(e) => handleSlotChange(slot.id, { startTime: e.target.value })}
                        className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        value={slot.endTime}
                        disabled={saving}
                        onChange={(e) => handleSlotChange(slot.id, { endTime: e.target.value })}
                        className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      disabled={saving}
                      onClick={() => handleSlotChange(slot.id, { active: !slot.active })}
                      className={`p-2 rounded-full ${slot.active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                      aria-label={slot.active ? 'Deactivate slot' : 'Activate slot'}
                    >
                      {slot.active ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={handleSave}
                disabled={saving}
                className={`px-6 py-3 rounded-lg text-white ${
                  saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
                } transition-colors`}
              >
                {saving ? 'Saving...' : 'Save Availability'}
              </button>
            </div>
          </div>

          {/* Optional Interactive Calendar and Timezone Selector */}
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Select Date & Time</h3>
            <DatePicker
              selected={selectedDate}
              onChange={date => setSelectedDate(date)}
              showTimeSelect
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              className="border rounded p-3 w-full max-w-sm mx-auto"
              placeholderText="Select date and time"
              popperPlacement="bottom"
            />

            <div className="mt-6 max-w-sm mx-auto text-left">
              <label htmlFor="timezone-select" className="block mb-2 font-semibold text-gray-700">
                Select Timezone
              </label>
              <select
                id="timezone-select"
                value={timezone}
                onChange={e => setTimezone(e.target.value)}
                className="border rounded px-3 py-2 w-full"
              >
                {timeZones.map(tz => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Availability;
