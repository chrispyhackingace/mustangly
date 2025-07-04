// src/context/AppContext.js
import React, { createContext, useState, useEffect } from 'react';

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

  // Initialize data from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedSlots = localStorage.getItem('availabilitySlots');
    const savedBookings = localStorage.getItem('bookedSlots');
    const savedPassword = localStorage.getItem('hostPassword');
    const savedSettings = localStorage.getItem('hostSettings');

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedSlots) setAvailabilitySlots(JSON.parse(savedSlots));
    else setAvailabilitySlots(initializeDefaultSlots());
    if (savedBookings) setBookedSlots(JSON.parse(savedBookings));
    if (savedPassword) setHostPassword(savedPassword);
    else {
      const defaultPassword = generateRandomPassword();
      setHostPassword(defaultPassword);
      localStorage.setItem('hostPassword', defaultPassword);
    }
    if (savedSettings) setHostSettings(JSON.parse(savedSettings));
  }, []);

  const initializeDefaultSlots = () => {
    return [
      { id: 1, day: 'Monday', startTime: '09:00', endTime: '17:00', active: true },
      { id: 2, day: 'Tuesday', startTime: '09:00', endTime: '17:00', active: true },
      { id: 3, day: 'Wednesday', startTime: '09:00', endTime: '17:00', active: true },
      { id: 4, day: 'Thursday', startTime: '09:00', endTime: '17:00', active: true },
      { id: 5, day: 'Friday', startTime: '09:00', endTime: '17:00', active: true },
    ];
  };

  const generateRandomPassword = () => {
    return Math.random().toString(36).slice(2, 10); // 8-character password
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
      updateHostSettings
    }}>
      {children}
    </AppContext.Provider>
  );
};