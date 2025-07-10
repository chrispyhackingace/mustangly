// src/context/AppContext.js
import React, { createContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
export const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [availabilitySlots, setAvailabilitySlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [timezone, setTimezone] = useState('America/New_York');
  const [notifications, setNotifications] = useState([]);
  const [guestInfo, setGuestInfo] = useState({ name: '', email: '' });
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [hostPassword, setHostPassword] = useState('');
  const [hostSettings, setHostSettings] = useState({
    meetingDuration: 30,
    bufferTime: 15,
    allowCancellation: true
  });

  // Initialize data from localStorage and Supabase
  useEffect(() => {
    const initializeData = async () => {
      const savedUser = localStorage.getItem('user');
      const savedPassword = localStorage.getItem('hostPassword');
      const savedSettings = localStorage.getItem('hostSettings');

      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedPassword) setHostPassword(savedPassword);
      else {
        const defaultPassword = generateRandomPassword();
        setHostPassword(defaultPassword);
        localStorage.setItem('hostPassword', defaultPassword);
      }
      if (savedSettings) setHostSettings(JSON.parse(savedSettings));

      // Load availability and bookings from Supabase if user is logged in
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        await loadAvailabilityFromSupabase(currentUser.id);
        await loadBookingsFromSupabase();
      } else {
        // Fallback to localStorage or default slots
        const savedSlots = localStorage.getItem('availabilitySlots');
        if (savedSlots) setAvailabilitySlots(JSON.parse(savedSlots));
        else setAvailabilitySlots(initializeDefaultSlots());
      }
    };

    initializeData();
  }, []);

  const initializeDefaultSlots = () => {
    return [
      { id: 1, day: 'Monday', startTime: '09:00', endTime: '17:00', active: true },
      { id: 2, day: 'Tuesday', startTime: '09:00', endTime: '17:00', active: true },
      { id: 3, day: 'Wednesday', startTime: '09:00', endTime: '17:00', active: true },
      { id: 4, day: 'Thursday', startTime: '09:00', endTime: '17:00', active: true },
      { id: 5, day: 'Friday', startTime: '09:00', endTime: '17:00', active: true },
      { id: 6, day: 'Saturday', startTime: '10:00', endTime: '16:00', active: false },
      { id: 7, day: 'Sunday', startTime: '10:00', endTime: '16:00', active: false },
    ];
  };

  const generateRandomPassword = () => {
    return Math.random().toString(36).slice(2, 10); // 8-character password
  };

  // Supabase functions for availability
  const loadAvailabilityFromSupabase = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('availability_slots')
        .select('*')
        .eq('user_id', userId)
        .order('id');

      if (error) {
        console.error('Error loading availability:', error);
        // Fallback to default slots
        setAvailabilitySlots(initializeDefaultSlots());
        return;
      }

      if (data && data.length > 0) {
        setAvailabilitySlots(data);
      } else {
        // No data in database, create default slots
        const defaultSlots = initializeDefaultSlots();
        setAvailabilitySlots(defaultSlots);
        await saveAvailabilityToSupabase(userId, defaultSlots);
      }
    } catch (err) {
      console.error('Error loading availability:', err);
      setAvailabilitySlots(initializeDefaultSlots());
    }
  };

  const saveAvailabilityToSupabase = async (userId, slots) => {
    try {
      // First, delete existing slots for this user
      await supabase
        .from('availability_slots')
        .delete()
        .eq('user_id', userId);

      // Then insert new slots
      const slotsWithUserId = slots.map(slot => ({
        ...slot,
        user_id: userId
      }));

      const { error } = await supabase
        .from('availability_slots')
        .insert(slotsWithUserId);

      if (error) {
        throw error;
      }

      return true;
    } catch (err) {
      console.error('Error saving availability:', err);
      throw err;
    }
  };

  const saveAvailability = async (slots) => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (currentUser) {
        await saveAvailabilityToSupabase(currentUser.id, slots);
        setAvailabilitySlots(slots);
        addNotification('Availability saved successfully', 'success');
      } else {
        // Fallback to localStorage if not logged in
        setAvailabilitySlots(slots);
        localStorage.setItem('availabilitySlots', JSON.stringify(slots));
        addNotification('Availability saved locally', 'success');
      }
    } catch (err) {
      console.error('Error saving availability:', err);
      addNotification('Failed to save availability', 'error');
      throw err;
    }
  };

  // Supabase functions for bookings
  const loadBookingsFromSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('id');

      if (error) {
        console.error('Error loading bookings:', error);
        addNotification('Failed to load bookings', 'error');
        return;
      }

      if (data) {
        setBookedSlots(data);
      }
    } catch (err) {
      console.error('Error loading bookings:', err);
      addNotification('Failed to load bookings', 'error');
    }
  };

  const saveBookingToSupabase = async (booking) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert(booking);

      if (error) {
        console.error('Error saving booking:', error);
        addNotification('Failed to save booking', 'error');
        return;
      }

      if (data) {
        setBookedSlots((prev) => [...prev, ...data]);
        addNotification('Booking saved successfully', 'success');
      }
    } catch (err) {
      console.error('Error saving booking:', err);
      addNotification('Failed to save booking', 'error');
    }
  };

  // Persist data to localStorage
  useEffect(() => localStorage.setItem('user', JSON.stringify(user)), [user]);
  useEffect(() => localStorage.setItem('availabilitySlots', JSON.stringify(availabilitySlots)), [availabilitySlots]);
  useEffect(() => localStorage.setItem('bookedSlots', JSON.stringify(bookedSlots)), [bookedSlots]);
  useEffect(() => localStorage.setItem('hostPassword', hostPassword), [hostPassword]);
  useEffect(() => localStorage.setItem('hostSettings', JSON.stringify(hostSettings)), [hostSettings]);

  const addNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };
    
    setNotifications(prev => [...prev, notification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 3000);
  };

  const updateAvailability = (slotId, updates) => {
    setAvailabilitySlots(prev => 
      prev.map(slot => 
        slot.id === slotId ? { ...slot, ...updates } : slot
      )
    );
    addNotification('Availability updated', 'success');
  };

  const handleBooking = () => {
    if (!guestInfo.name || !guestInfo.email) {
      addNotification('Please enter name and email', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guestInfo.email)) {
      addNotification('Invalid email format', 'error');
      return;
    }

    const newBooking = {
      id: Date.now(),
      clientName: guestInfo.name,
      clientEmail: guestInfo.email,
      date: selectedDate,
      time: selectedTime,
      duration: hostSettings.meetingDuration
    };
    
    setBookedSlots(prev => [...prev, newBooking]);
    addNotification('Meeting booked!', 'success');
    
    // Reset form
    setGuestInfo({ name: '', email: '' });
    setSelectedDate('');
    setSelectedTime('');
    setCurrentView('confirmation');
  };

  const verifyHost = (name, password) => {
    return name === user?.name && password === hostPassword;
  };

  const updateHostPassword = (newPassword) => {
    setHostPassword(newPassword);
    addNotification('Host password updated', 'success');
  };

  const updateHostSettings = (newSettings) => {
    setHostSettings(newSettings);
    addNotification('Settings updated', 'success');
  };

  return (
    <AppContext.Provider value={{
      currentView,
      setCurrentView,
      user,
      setUser,
      availabilitySlots,
      setAvailabilitySlots,
      bookedSlots,
      setBookedSlots,
      timezone,
      setTimezone,
      notifications,
      guestInfo,
      setGuestInfo,
      selectedDate,
      setSelectedDate,
      selectedTime,
      setSelectedTime,
      hostPassword,
      hostSettings,
      updateAvailability,
      handleBooking,
      addNotification,
      verifyHost,
      updateHostPassword,
      updateHostSettings,
      saveAvailability
    }}>
      {children}
    </AppContext.Provider>
  );
};