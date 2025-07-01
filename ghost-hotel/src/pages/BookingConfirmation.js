import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomType } = location.state || {};

  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [locationInput, setLocationInput] = useState('');

  if (!roomType) {
    // If no room selected, redirect to rooms page
    navigate('/rooms');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:5000/api/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, roomType, date, location: locationInput }),
    });

    const data = await res.json();

    if (res.ok) {
      alert('Booking confirmed!');
      navigate('/');
    } else {
      alert(data.message || 'Booking failed');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Confirm Your Booking</h2>
      <form className="w-50 mx-auto" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Your Name</label>
          <input
            className="form-control"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Room Type</label>
          <input
            className="form-control"
            value={roomType}
            disabled
          />
        </div>
        <div className="mb-3">
          <label>Location</label>
          <input
            className="form-control"
            value={locationInput}
            onChange={e => setLocationInput(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Booking Date</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-success w-100" type="submit">Confirm Booking</button>
      </form>
    </div>
  );
};

export default BookingConfirmation;
