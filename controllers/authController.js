const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Signup Controller
exports.signup = async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password || !role) {
    return res.status(400).json({ error: 'Username, email, password, and role are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // 1. Insert into users table
    const [result] = await db.query(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, role]
    );

    const id = result.insertId;

    // 2. If role is voter, insert into voters table too
    if (role === 'voter') {
      await db.query(
        'INSERT INTO voters (id, name, email, age, address, mobile, isRegistered) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, username, email, 0, '', '', false] // defaults: age=0, address='', mobile='', isRegistered=false
      );
    }

    // 3. Generate token
    const token = jwt.sign({ id, username, email, role }, process.env.JWT_SECRET || 'secretkey', {
      expiresIn: '1h',
    });

    console.log(`✅ Signup successful for: ${email} (as ${role})`);
    res.status(201).json({ token });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email already exists' });
    }

    console.error('Signup error:', err);
    res.status(500).json({ error: 'Signup failed' });
  }
};

// Login Controller
exports.login = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Email, password, and role are required' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ? AND role = ?', [email, role]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email, password or role' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: 'Invalid email, password or role' });
    }

    const token = jwt.sign({ id: user.id, username: user.username, email: user.email, role: user.role }, process.env.JWT_SECRET || 'secretkey', {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

