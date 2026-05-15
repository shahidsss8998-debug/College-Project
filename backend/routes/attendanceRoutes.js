const express = require('express');
const { markAttendance, getAttendanceHistory, getAttendanceSummary,
  getSuggestedDayOrder,
  getAttendanceRecords,
  getAttendanceRecordById,
  updateAttendanceRecord
} = require('../controllers/attendanceController');
const router = express.Router();

router.post('/mark', markAttendance);
router.get('/history/:studentId', getAttendanceHistory);
router.get('/summary/:studentId', getAttendanceSummary);
router.get('/suggested-day-order', getSuggestedDayOrder);

// Admin Records Management Routes
router.get('/records', getAttendanceRecords);
router.get('/records/:id', getAttendanceRecordById);
router.put('/records/:id', updateAttendanceRecord);

module.exports = router;
