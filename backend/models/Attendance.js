const mongoose = require('mongoose');

const attendanceSchema = mongoose.Schema({
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  dayOrder: { type: String, enum: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'], required: true },
  department: { type: String, required: true }, // e.g. BCA, B.Sc CS
  semester: { type: String, required: true }, // e.g. 1st Semester
  status: { type: String, enum: ['completed', 'pending'], default: 'completed' },
  students: [{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    periods: [{ type: String, enum: ['present', 'absent'], default: 'absent' }] // Array of 5 strings
  }]
}, {
  timestamps: true
});

// Ensure only one attendance record per class per date
attendanceSchema.index({ date: 1, department: 1, semester: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;
