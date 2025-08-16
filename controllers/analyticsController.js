const db = require('../config/db');

// Query 1: List all candidates in Parliament elections
exports.getParliamentCandidates = (req, res) => {
    const query = `
  SELECT e.title AS election_title, c.name AS candidate_name
  FROM elections e
  JOIN candidates c ON e.id = c.e_id;
`;
    db.query(query, (err, results) => {
        if (err) {
            console.error("SQL error:", err);
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json(results);
    });
};

// Query 2: Total number of voters per election
exports.getVoterCountPerElection = (req, res) => {
    const query = `
        SELECT e.title AS election_title, COUNT(v.id) AS voter_count
        FROM elections e
        LEFT JOIN votes v ON e.id = v.election_id
        GROUP BY e.id;
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: "Query failed" });
        res.json(results);
    });
};

// Query 3: Number of votes per candidate
exports.getVotesPerCandidate = (req, res) => {
    const query = `
        SELECT c.name AS candidate_name, COUNT(v.id) AS votes_received
        FROM candidates c
        LEFT JOIN votes v ON c.id = v.candidate_id
        GROUP BY c.id;
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: "Query failed" });
        res.json(results);
    });
};

// Query 4: Candidates who received more than 50 votes
exports.getCandidatesWith50PlusVotes = (req, res) => {
    const query = `
        SELECT c.name AS candidate_name, COUNT(v.id) AS total_votes
        FROM candidates c
        JOIN votes v ON c.id = v.candidate_id
        GROUP BY c.id
        HAVING total_votes > 50;
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: "Query failed" });
        res.json(results);
    });
};

// Query 5: Elections that had more than 100 voters
exports.getElectionsWith100PlusVoters = (req, res) => {
    const query = `
        SELECT e.title AS election_title, COUNT(v.id) AS total_votes
        FROM elections e
        JOIN votes v ON e.id = v.election_id
        GROUP BY e.id
        HAVING total_votes > 100;
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: "Query failed" });
        res.json(results);
    });
};

// Query 6: Voters who voted more than once (if allowed)
exports.getDuplicateVoters = (req, res) => {
    const query = `
        SELECT v.voter_id, COUNT(*) AS vote_count
        FROM votes v
        GROUP BY v.voter_id
        HAVING vote_count > 1;
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: "Query failed" });
        res.json(results);
    });
};

// Query 7: Candidates and their election title
exports.getCandidatesWithElections = (req, res) => {
    const query = `
        SELECT c.name AS candidate_name, e.title AS election_title
        FROM candidates c
        JOIN elections e ON c.e_id = e.id;
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: "Query failed" });
        res.json(results);
    });
};

// Query 8: List of voters with the candidates they voted for
exports.getVoterVotesDetails = (req, res) => {
    const query = `
        SELECT vtr.name AS voter_name, c.name AS candidate_name, e.title AS election_title
        FROM votes v
        JOIN voters vtr ON v.voter_id = vtr.id
        JOIN candidates c ON v.candidate_id = c.id
        JOIN elections e ON v.election_id = e.id;
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: "Query failed" });
        res.json(results);
    });
};
