import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/Home.css';
import room1 from '../assets/room1.jpg';
import room2 from '../assets/room2.jpg';
import hero from '../assets/room3.jpg';

const Rooms = () => {
  const navigate = useNavigate();

  const handleBookNow = (roomType) => {
    navigate('/booking', { state: { roomType } });
  };

  return (
    <div className="rooms-section" style={{ backgroundImage: `url(${hero})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="overlay">
        <h2 className="section-title">Our Rooms</h2>
        <div className="rooms-container">
          <div className="room-card">
            <img src={room1} alt="Deluxe Room" />
            <h3>Deluxe Room</h3>
            <p>Modern amenities with a touch of luxury. Perfect for a relaxing stay.</p>
            <button className="book-button" onClick={() => handleBookNow('Deluxe Room')}>Book Now</button>
          </div>
          <div className="room-card">
            <img src={room2} alt="Executive Suite" />
            <h3>Executive Suite</h3>
            <p>Spacious and elegant with exclusive services for business & leisure.</p>
            <button className="book-button" onClick={() => handleBookNow('Executive Suite')}>Book Now</button>
          </div>
          <div className="room-card">
            <img src={hero} alt="Standard Room" />
            <h3>Standard Room</h3>
            <p>A budget-friendly room for a peaceful stay at our hotel.</p>
            <button className="book-button" onClick={() => handleBookNow('Standard Room')}>Book Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rooms;
