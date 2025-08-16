const express = require('express');
const router = express.Router();
const controller = require('../controllers/votesControllers');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, controller.getAllVotes);
router.get('/check/:voterId', authMiddleware, controller.checkVoterVoteStatus);
router.get('/analytics/:electionType', authMiddleware, controller.getVoteAnalytics);
router.post('/', authMiddleware, controller.castVote);

module.exports = router;
