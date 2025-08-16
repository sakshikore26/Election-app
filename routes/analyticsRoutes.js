const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/parliament-candidates', verifyToken, analyticsController.getParliamentCandidates);
router.get('/voter-count-per-election', verifyToken, analyticsController.getVoterCountPerElection);
router.get('/votes-per-candidate', verifyToken, analyticsController.getVotesPerCandidate);
router.get('/candidates-with-50-plus-votes', verifyToken, analyticsController.getCandidatesWith50PlusVotes);
router.get('/elections-with-100-plus-voters', verifyToken, analyticsController.getElectionsWith100PlusVoters);
router.get('/duplicate-voters', verifyToken, analyticsController.getDuplicateVoters);
router.get('/candidates-with-elections', verifyToken, analyticsController.getCandidatesWithElections);
router.get('/voter-votes-details', verifyToken, analyticsController.getVoterVotesDetails);

module.exports = router;
