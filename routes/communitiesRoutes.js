const express = require('express');
const authenticateToken = require('../middlewares/authMiddleware');
const communitiesController = require('../controllers/communitiesController');

const router = express.Router();

// Create a community
router.post('/', authenticateToken, communitiesController.createCommunity);

// Get all communities
router.get('/', authenticateToken, communitiesController.getAllCommunities);

module.exports = router;
