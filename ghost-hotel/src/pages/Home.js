import React from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Added for navigation
import './Home.css';
import heroImage from '../assets/hero.jpg';
import room1 from '../assets/room1.jpg';
import room2 from '../assets/room2.jpg';
import attraction from '../assets/attraction.jpg';

const Home = () => {
  const navigate = useNavigate(); // ✅ Hook for navigation

  return (
    <div className="home-container">

      {/* Hero Section */}
      <section className="hero-section" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="overlay">
          <h1 className="hero-title">Welcome to GHOST Hotel</h1>
          <p className="hero-subtitle">Experience luxury, comfort, and unforgettable stays</p>
          <button className="book-button" onClick={() => navigate('/rooms')}>Book Now</button> {/* ✅ Updated */}
        </div>
      </section>

      {/* Rooms Section */}
      <section className="rooms-section">
        <h2 className="section-title">Our Rooms</h2>
        <div className="rooms-container">
          <div className="room-card">
            <img src={room1} alt="Deluxe Room" />
            <h3>Deluxe Room</h3>
            <p>Modern amenities with a touch of luxury. Perfect for a relaxing stay.</p>
          </div>
          <div className="room-card">
            <img src={room2} alt="Suite Room" />
            <h3>Executive Suite</h3>
            <p>Spacious and elegant with exclusive services for business & leisure.</p>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="amenities-section">
        <h2 className="section-title">Amenities</h2>
        <ul className="amenities-list">
          <li>🏊 Swimming Pool</li>
          <li>🍽️ Fine Dining</li>
          <li>🛜 Free Wi-Fi</li>
          <li>🚗 Free Parking</li>
          <li>🧖 Spa & Wellness</li>
        </ul>
      </section>

      {/* Nearby Attractions */}
      <section className="attractions-section" style={{ backgroundImage: `url(${attraction})` }}>
        <div className="overlay">
          <h2 className="section-title">Nearby Attractions</h2>
          <p>Explore the best places around our hotel – from shopping to heritage.</p>
          <button className="explore-button">Explore Now</button>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <h2 className="section-title">About GHOST Hotel</h2>
        <p>GHOST Hotel blends comfort with class. Our mission is to offer world-class service with a personal touch. Discover the best of luxury stays, fine dining, and seamless hospitality.</p>
      </section>

    </div>
  );
};

export default Home;
