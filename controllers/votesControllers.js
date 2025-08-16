const db = require('../config/db');

// Cast a vote
exports.castVote = async (req, res) => {
  const { voter_id, candidate_id, election_id, election_type } = req.body;
  
  try {
    // First check if voter has already voted in this election type
    const [existingVotes] = await db.execute(
      'SELECT v.* FROM votes v JOIN candidates c ON v.candidate_id = c.id WHERE v.voter_id = ? AND c.electionType = ?',
      [voter_id, election_type]
    );
    
    if (existingVotes.length > 0) {
      return res.status(400).json({ message: 'You have already voted in this election type.' });
    }
    
    // Cast the vote
    const [result] = await db.execute(
      'INSERT INTO votes (voter_id, candidate_id, election_id) VALUES (?, ?, ?)',
      [voter_id, candidate_id, election_id]
    );
    
    res.status(201).json({ message: 'Vote cast successfully!' });
  } catch (error) {
    console.error('Error casting vote:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all votes
exports.getAllVotes = (req, res) => {
  db.query('SELECT * FROM votes', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// Check if voter has already voted in an election type
exports.checkVoterVoteStatus = async (req, res) => {
  const { voterId } = req.params;
  const { electionType } = req.query;
  
  try {
    const [votes] = await db.execute(
      'SELECT v.* FROM votes v JOIN candidates c ON v.candidate_id = c.id WHERE v.voter_id = ? AND c.electionType = ?',
      [voterId, electionType]
    );
    
    res.status(200).json({ 
      hasVoted: votes.length > 0,
      voteCount: votes.length 
    });
  } catch (error) {
    console.error('Error checking vote status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get vote analytics for a specific election type
exports.getVoteAnalytics = async (req, res) => {
  const { electionType } = req.params;
  
  try {
    const [results] = await db.execute(`
      SELECT 
        c.id,
        c.name,
        c.party,
        c.place,
        COUNT(v.id) as vote_count
      FROM candidates c
      LEFT JOIN votes v ON c.id = v.candidate_id
      WHERE c.electionType = ?
      GROUP BY c.id, c.name, c.party, c.place
      ORDER BY vote_count DESC
    `, [electionType]);
    
    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching vote analytics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

