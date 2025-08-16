const db = require('../config/db');

// Create an election
exports.createElection = (req, res) => {
  const { title, date } = req.body;
  const query = 'INSERT INTO elections (title, date) VALUES (?, ?)';
  db.query(query, [title, date], (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ id: result.insertId, title, date });
  });
};

// Get all elections
exports.getAllElections = (req, res) => {
  db.query('SELECT * FROM elections', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

