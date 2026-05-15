const express = require('express');
const { getAnnouncements, createAnnouncement, deleteAnnouncement } = require('../controllers/announcementController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getAnnouncements);
router.post('/', protect, admin, createAnnouncement);
router.delete('/:id', protect, admin, deleteAnnouncement);

module.exports = router;
