const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement,
  getEvents, createEvent, updateEvent, registerForEvent, deleteEvent,
  getResources, createResource, updateResource, deleteResource
} = require('../controllers/portalController');

// Announcements
router.get('/announcements', protect, getAnnouncements);
router.post('/announcements', protect, admin, createAnnouncement);
router.put('/announcements/:id', protect, admin, updateAnnouncement);
router.delete('/announcements/:id', protect, admin, deleteAnnouncement);

// Events
router.get('/events', protect, getEvents);
router.post('/events', protect, admin, createEvent);
router.put('/events/:id', protect, admin, updateEvent);
router.post('/events/:id/register', protect, registerForEvent);
router.delete('/events/:id', protect, admin, deleteEvent);

// Resources
router.get('/resources', protect, getResources);
router.post('/resources', protect, admin, createResource);
router.put('/resources/:id', protect, admin, updateResource);
router.delete('/resources/:id', protect, admin, deleteResource);

module.exports = router;
