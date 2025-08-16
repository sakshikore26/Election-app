// controllers/candidateController.js
const db = require('../config/db');

exports.getByElectionType = async (req, res, electionType) => {
  try {
    const [rows] = await db.execute('SELECT * FROM candidates WHERE electionType = ?', [electionType]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: `No candidates found for election type: ${electionType}` });
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.addCandidate = async (req, res) => {
  const { name, party, place, electionType } = req.body;

  // Validate required fields
  if (!name || !party || !place || !electionType) {
    return res.status(400).json({ message: 'All fields (name, party, place, electionType) are required.' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO candidates (name, party, place, electionType) VALUES (?, ?, ?, ?)',
      [name, party, place, electionType]
    );

    res.status(201).json({ message: 'Candidate added successfully', candidateId: result.insertId });
  } catch (error) {
    console.error('Error adding candidate:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
