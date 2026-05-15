const express = require('express');
const { loginUser, getStudents, addStudent, updateStudent, deleteStudent, getUserProfile, getDashboardStats, getStudentFullProfile, testEmail } = require('../controllers/authController');
const router = express.Router();

router.post('/login', loginUser);
router.get('/dashboard-stats', getDashboardStats);
router.get('/students', getStudents);
router.get('/profile/:id', getUserProfile);
router.post('/students', addStudent);
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);
router.get('/students/:id/full-profile', getStudentFullProfile);
router.get('/test-email', testEmail);

module.exports = router;
