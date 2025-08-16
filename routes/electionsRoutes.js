const express = require('express');
const router = express.Router();
const controller = require('../controllers/electionsController');

router.get('/', controller.getAllElections);
router.post('/', controller.createElection);

module.exports = router;
