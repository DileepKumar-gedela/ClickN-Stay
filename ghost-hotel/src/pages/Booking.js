// src/pages/Booking.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Booking = () => {
  const { userEmail, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [roomType, setRoomType] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');

  const today = new Date();
  const twoMonthsLater = new Date();
  twoMonthsLater.setMonth(today.getMonth() + 2);

  const formatDate = (d) => d.toISOString().split('T')[0];
  const minDateStr = formatDate(today);
  const maxDateStr = formatDate(twoMonthsLater);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !roomType || !date || !location) {
      alert('Please fill all fields');
      return;
    }

    if (!userEmail) {
      alert('You must log in to book');
      navigate('/login');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, roomType, date, location, email: userEmail }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('✅ Booking confirmed. You will now be logged out.');
        setName('');
        setRoomType('');
        setDate('');
        setLocation('');
        logout();              // ✅ Log out user after booking
        navigate('/login');   // ✅ Redirect to login
      } else {
        alert(data.message || 'Booking failed');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Server error. Try again later.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Booking Page</h2>

      <form className="w-50 mx-auto" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Your Name</label>
          <input
            className="form-control"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>

        <div className="mb-3">
          <label>Room Type</label>
          <select
            className="form-control"
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            required
          >
            <option value="">Select Room</option>
            <option value="Standard">Standard</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Suite">Suite</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Booking Date</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={minDateStr}
            max={maxDateStr}
            required
          />
        </div>

        <div className="mb-3">
          <label>Location</label>
          <select
            className="form-control"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          >
            <option value="">Select State</option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Kerala">Kerala</option>
            <option value="Goa">Goa</option>
            <option value="Telangana">Telangana</option>
          </select>
        </div>

        <button className="btn btn-success w-100" type="submit">
          Confirm Booking
        </button>
      </form>

      <p className="text-center mt-4">
        <strong>Logged in as:</strong> {userEmail || '❌ Not logged in'}
      </p>
    </div>
  );
};

export default Booking;
