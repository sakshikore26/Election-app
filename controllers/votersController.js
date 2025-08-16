const db = require('../config/db');

// Create a voter
exports.createVoter = async (req, res) => {
  const { name, age } = req.body;
  if (!name || !age) return res.status(400).json({ message: "Name and age are required" });

  try {
    const [result] = await db.query('INSERT INTO voters (name, age) VALUES (?, ?)', [name, age]);
    res.status(201).json({ id: result.insertId, name, age });
  } catch (err) {
    console.error('Create voter error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all voters
exports.getAllVoters = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM voters');
    res.json(results);
  } catch (err) {
    console.error('Get all voters error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get voter by ID
exports.getVoterById = async (req, res) => {
  console.log('🔍 Fetching voter ID:', req.params.id);

  try {
    const [rows] = await db.query('SELECT * FROM voters WHERE id = ?', [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Voter not found' });
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching voter:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a voter's email and address only
exports.updateVoterProfile = async (req, res) => {
  const id = req.params.id;
  const { email, address } = req.body;

  if (!email || !address) {
    return res.status(400).json({ message: 'Email and address are required' });
  }

  try {
    const [updateResult] = await db.query('UPDATE voters SET email = ?, address = ? WHERE id = ?', [email, address, id]);
    
    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: 'Voter not found' });
    }
    
    // Fetch and return the updated voter data
    const [selectResult] = await db.query('SELECT * FROM voters WHERE id = ?', [id]);
    res.status(200).json(selectResult[0]);
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Register a voter with constraints
exports.registerVoter = async (req, res) => {
  const { id, aadhaar_no, voter_id_no, address, dob, nationality } = req.body;

  if (!aadhaar_no || !voter_id_no || !address || !dob || !nationality) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (nationality !== 'Indian') {
    return res.status(400).json({ message: 'Only Indian citizens can register' });
  }

  try {
    // Check age
    const [ageResult] = await db.query('SELECT TIMESTAMPDIFF(YEAR, ?, CURDATE()) AS age', [dob]);
    if (ageResult[0].age < 18) {
      return res.status(400).json({ message: 'Voter must be at least 18 years old' });
    }

    // Update voter registration
    const updateQuery = `
      UPDATE voters SET aadhaar_no = ?, voter_id_no = ?, address = ?, dob = ?, nationality = ?, isRegistered = TRUE
      WHERE id = ?
    `;
    const [updateResult] = await db.query(updateQuery, [aadhaar_no, voter_id_no, address, dob, nationality, id]);
    
    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: 'Voter not found' });
    }
    
    // Fetch and return the updated voter data
    const [selectResult] = await db.query('SELECT * FROM voters WHERE id = ?', [id]);
    res.status(200).json(selectResult[0]);
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a voter
exports.deleteVoter = async (req, res) => {
  const id = req.params.id;

  try {
    const [result] = await db.query('DELETE FROM voters WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Voter not found' });
    }
    
    res.status(200).json({ message: `Voter ${id} deleted successfully` });
  } catch (err) {
    console.error('Delete voter error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Get vote counts per candidate for a given election type (for bar chart)
exports.getBarChartData = async (req, res) => {
  const { electionType } = req.params;

  try {
    // Get all candidates for the election type, and count votes for each
    const [results] = await db.execute(`
      SELECT 
        c.id,
        c.name,
        c.party,
        c.place,
        COUNT(v.id) AS vote_count
      FROM candidates c
      LEFT JOIN votes v ON c.id = v.candidate_id
      WHERE c.electionType = ?
      GROUP BY c.id, c.name, c.party, c.place
      ORDER BY vote_count DESC, c.name ASC
    `, [electionType]);

    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching bar chart data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};