const express = require('express');
const authenticateToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const eventsController = require('../controllers/eventsController');

const router = express.Router();

// Anyone authenticated can view events
router.get('/', authenticateToken, eventsController.getAllEvents);
router.get('/:id', authenticateToken, eventsController.getEventById);

// Only authenticated users can create events
router.post('/', authenticateToken, eventsController.createEvent);

// Only event creator or admin can update/delete
router.put('/:id', authenticateToken, eventsController.updateEvent);
router.delete('/:id', authenticateToken, eventsController.deleteEvent);

module.exports = router;
