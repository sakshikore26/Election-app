const express = require('express');
const router = express.Router();
const voterController = require('../controllers/votersController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', voterController.getAllVoters);
router.post('/', voterController.createVoter);
router.get('/:id', voterController.getVoterById);
router.put('/profile/:id', voterController.updateVoterProfile);
router.post('/register', voterController.registerVoter);
router.delete('/:id', voterController.deleteVoter);
router.get('/barchart/:electionType', authMiddleware, voterController.getBarChartData);


module.exports = router;


