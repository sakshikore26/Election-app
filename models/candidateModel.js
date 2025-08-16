// models/candidateModel.js
const db = require('../config/db');

const Candidate = {
  getAll: (electionType, callback) => {
    const sql = 'SELECT * FROM candidates WHERE electionType = ?';
    db.query(sql, [electionType], callback);
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM candidates WHERE id = ?', [id], callback);
  },

  create: (data, callback) => {
    const sql = 'INSERT INTO candidates (name, party, place, electionType) VALUES (?, ?, ?, ?)';
    db.query(sql, [data.name, data.party, data.place, data.electionType], callback);
  },

  update: (id, data, callback) => {
    const sql = 'UPDATE candidates SET name = ?, party = ?, place = ?, electionType = ? WHERE id = ?';
    db.query(sql, [data.name, data.party, data.place, data.electionType, id], callback);
  },

  remove: (id, callback) => {
    db.query('DELETE FROM candidates WHERE id = ?', [id], callback);
  }
};

module.exports = Candidate;
