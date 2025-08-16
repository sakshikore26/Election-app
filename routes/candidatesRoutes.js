// routes/candidatesRoutes.js
const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidatesControllers');

// General GET route with query parameter
router.get('/', (req, res) => {
  const { electionType } = req.query;
  if (!electionType) {
    return res.status(400).json({ message: 'electionType query parameter is required' });
  }
  candidateController.getByElectionType(req, res, electionType);
});

// GET Routes
router.get('/Lok_Sabha', (req, res) => candidateController.getByElectionType(req, res, 'Lok_Sabha'));
router.get('/Vidhan_Sabha', (req, res) => candidateController.getByElectionType(req, res, 'Vidhan_Sabha'));
router.get('/Nagar_Palika', (req, res) => candidateController.getByElectionType(req, res, 'Nagar_Palika'));

// POST Route to add candidate
router.post('/add', candidateController.addCandidate);

module.exports = router;
