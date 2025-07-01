import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [logins, setLogins] = useState([]);
  const [roomFilter, setRoomFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const fetchAllData = () => {
    fetch('http://localhost:5000/api/users')
      .then(res => res.json()).then(setUsers);

    fetch('http://localhost:5000/api/bookings')
      .then(res => res.json()).then(setBookings);

    fetch('http://localhost:5000/api/logins')
      .then(res => res.json()).then(setLogins);
  };

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this booking?')) return;

    const res = await fetch(`http://localhost:5000/api/bookings/${id}`, { method: 'DELETE' });
    if (res.ok) {
      alert('Deleted');
      fetchAllData();
    }
  };

  const handleReset = () => {
    setRoomFilter('');
    setDateFilter('');
  };

  // ✅ Fix: format MySQL timestamp to just YYYY-MM-DD before comparison
  const filteredBookings = bookings.filter(b => {
    const bookingDate = b.date.slice(0, 10); // keep only 'YYYY-MM-DD'
    const matchRoom = roomFilter ? b.room_type === roomFilter : true;
    const matchDate = dateFilter ? bookingDate === dateFilter : true;
    return matchRoom && matchDate;
  });

  // ✅ Optional: Show date as DD-MM-YYYY
  const formatDate = (str) => {
    const [y, m, d] = str.slice(0, 10).split('-');
    return `${d}-${m}-${y}`;
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">📊 Admin Dashboard</h2>

      {/* Users Table */}
      <h4>👤 Registered Users</h4>
      <table className="table table-bordered">
        <thead><tr><th>ID</th><th>Email</th></tr></thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}><td>{user.id}</td><td>{user.email}</td></tr>
          ))}
        </tbody>
      </table>

      {/* Booking Filters */}
      <h4 className="mt-5">🏨 Bookings</h4>
      <div className="row mb-3">
        <div className="col-md-4">
          <label>Filter by Room Type</label>
          <select className="form-control" value={roomFilter} onChange={e => setRoomFilter(e.target.value)}>
            <option value="">All</option>
            <option value="Standard">Standard</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Suite">Suite</option>
          </select>
        </div>
        <div className="col-md-4">
          <label>Filter by Date</label>
          <input
            type="date"
            className="form-control"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
          />
        </div>
        <div className="col-md-4 d-flex align-items-end">
          <button className="btn btn-secondary w-100" onClick={handleReset}>Reset Filters</button>
        </div>
      </div>

      {/* Bookings Table */}
      <table className="table table-bordered text-center">
        <thead className="table-dark">
          <tr>
            <th>#</th><th>Name</th><th>Email</th><th>Room</th><th>Date</th><th>Location</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredBookings.length === 0 ? (
            <tr><td colSpan="7">No bookings found</td></tr>
          ) : (
            filteredBookings.map((b, i) => (
              <tr key={b.id}>
                <td>{i + 1}</td>
                <td>{b.name}</td>
                <td>{b.email}</td>
                <td>{b.room_type}</td>
                <td>{formatDate(b.date)}</td>
                <td>{b.location}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(b.id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Login Logs */}
      <h4 className="mt-5">🔐 Login Logs</h4>
      <table className="table table-bordered">
        <thead><tr><th>Email</th><th>Status</th><th>Time</th></tr></thead>
        <tbody>
          {logins.map((log, i) => (
            <tr key={i}>
              <td>{log.email}</td>
              <td>{log.success ? '✅ Success' : '❌ Failed'}</td>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
