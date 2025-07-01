const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'ghost_hotel',
});

db.connect(err => {
  if (err) throw err;
  console.log('✅ MySQL connected');
});


// ✅ Signup with email check
app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'DB error during email check' });

    if (results.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);

    db.query(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashed],
      (err) => {
        if (err) return res.status(500).json({ message: 'Error saving user' });
        res.json({ message: 'User registered successfully' });
      }
    );
  });
});


// ✅ Login with tracking
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'DB error during login' });

    const loginSuccess = results.length > 0 && await bcrypt.compare(password, results[0].password);

    db.query(
      'INSERT INTO login_logs (email, success) VALUES (?, ?)',
      [email, loginSuccess ? 1 : 0]
    );

    if (loginSuccess) {
      res.json({ message: 'Login success' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});


// ✅ Booking API with validation and safe error logging
app.post('/api/book', (req, res) => {
  const { name, roomType, date, location, email } = req.body;

  console.log('📥 Booking request received:', req.body);

  if (!name || !roomType || !date || !location || !email) {
    console.log('❌ Missing fields:', { name, roomType, date, location, email });
    return res.status(400).json({ message: 'All fields (including login) are required' });
  }

  const sql = 'INSERT INTO bookings (name, room_type, date, location, email) VALUES (?, ?, ?, ?, ?)';

  db.query(sql, [name, roomType, date, location, email], (err, result) => {
    if (err) {
      console.error('❌ Booking DB error:', err.code, '-', err.sqlMessage);
      return res.status(500).json({ message: 'Booking failed', error: err.sqlMessage });
    }

    console.log('✅ Booking saved successfully');
    res.json({ message: 'Booking successful' });
  });
});


// ✅ Get users
app.get('/api/users', (req, res) => {
  db.query('SELECT id, email FROM users ORDER BY id DESC', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching users' });
    res.json(results);
  });
});


// ✅ Get bookings
app.get('/api/bookings', (req, res) => {
  db.query('SELECT * FROM bookings ORDER BY id DESC', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching bookings' });
    res.json(results);
  });
});


// ✅ Delete a booking
app.delete('/api/bookings/:id', (req, res) => {
  const id = req.params.id;

  db.query('DELETE FROM bookings WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error deleting booking' });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking deleted successfully' });
  });
});


// ✅ Get login logs
app.get('/api/logins', (req, res) => {
  db.query('SELECT * FROM login_logs ORDER BY timestamp DESC', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching login logs' });
    res.json(results);
  });
});


// ✅ Admin HTML booking table
app.get('/bookings-view', (req, res) => {
  db.query('SELECT * FROM bookings ORDER BY id DESC', (err, results) => {
    if (err) {
      return res.status(500).send('<h2>Error fetching bookings</h2>');
    }

    let html = `
      <html><head><title>Bookings</title><style>
        body { font-family: Arial; padding: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
        th { background: #333; color: white; }
      </style></head><body>
      <h2>All Bookings</h2>
      <table><thead><tr>
        <th>ID</th><th>Name</th><th>Email</th><th>Room</th><th>Date</th><th>Location</th>
      </tr></thead><tbody>
    `;

    results.forEach(b => {
      html += `
        <tr>
          <td>${b.id}</td><td>${b.name}</td><td>${b.email}</td>
          <td>${b.room_type}</td><td>${new Date(b.date).toLocaleDateString()}</td><td>${b.location}</td>
        </tr>
      `;
    });

    html += '</tbody></table></body></html>';
    res.send(html);
  });
});


// ✅ Start server
app.listen(5000, () => console.log('🚀 Server running on http://localhost:5000'));
