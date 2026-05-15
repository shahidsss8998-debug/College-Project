const Attendance = require('../models/Attendance');

// Mark attendance for an entire class (Batch)
const markAttendance = async (req, res) => {
  const { date, dayOrder, department, semester, students } = req.body;

  try {
    // Check if record exists for this date and class
    let record = await Attendance.findOne({ date, department, semester });

    if (record) {
      // Update existing record
      record.dayOrder = dayOrder;
      record.students = students;
      record.status = 'completed';
    } else {
      // Create new record
      record = new Attendance({
        date,
        dayOrder,
        department,
        semester,
        students,
        status: 'completed'
      });
    }

    await record.save();
    res.json({ message: 'Attendance marked successfully' });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Retrieve individual student history mapping from batches
const getAttendanceHistory = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    // Find all batches where this student is present
    const batches = await Attendance.find({ "students.studentId": studentId }).lean();
    
    // Map to the old structure for frontend compatibility
    const history = batches.map(b => {
      const studentData = b.students.find(s => s.studentId.toString() === studentId);
      return {
        date: b.date,
        dayOrder: b.dayOrder,
        periods: studentData ? studentData.periods : []
      };
    }).sort((a, b) => b.date.localeCompare(a.date));

    res.json(history);
  } catch (error) {
    console.error('Error fetching attendance history:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Retrieve individual student summary mapping from batches
const getAttendanceSummary = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const batches = await Attendance.find({ "students.studentId": studentId }).lean();

    const records = batches.map(b => {
      const studentData = b.students.find(s => s.studentId.toString() === studentId);
      return {
        date: b.date,
        dayOrder: b.dayOrder,
        periods: studentData ? studentData.periods : []
      };
    });

    if (records.length === 0) {
      return res.json({
        summary: { totalPeriods: 0, present: 0, absent: 0, percentage: 0 },
        weekly: [],
        monthly: [],
        dayOrderReports: []
      });
    }

    // Helper for calculations
    const calculateStats = (records, isOverall = false) => {
      let presentPeriods = 0;
      let totalPeriods = records.length * 5;
      let daysPresent = 0;
      const daysTotal = records.length;

      records.forEach(r => {
        let dailyPresent = 0;
        if (r.periods) {
          r.periods.forEach(p => { if (p === 'present') dailyPresent++; });
        }
        presentPeriods += dailyPresent;
        if (dailyPresent >= 3) daysPresent++;
      });

      return {
        totalPeriods,
        presentPeriods,
        daysPresent,
        totalWorkingDays: daysTotal,
        percentage: daysTotal > 0 ? ((daysPresent / daysTotal) * 100).toFixed(1) : 0
      };
    };

    const overallSummary = calculateStats(records, true);

    const monthlyGroups = {};
    records.forEach(record => {
      const month = record.date.substring(0, 7);
      if (!monthlyGroups[month]) monthlyGroups[month] = [];
      monthlyGroups[month].push(record);
    });

    const monthlyReports = Object.keys(monthlyGroups).map(month => ({
      label: new Date(month + "-01").toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
      ...calculateStats(monthlyGroups[month])
    })).sort((a, b) => b.label.localeCompare(a.label));

    const getWeekNumber = (d) => {
      const date = new Date(d);
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() + 4 - (date.getDay() || 7));
      const yearStart = new Date(date.getFullYear(), 0, 1);
      return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
    };

    const weeklyGroups = {};
    records.forEach(record => {
      const week = `Week ${getWeekNumber(record.date)}, ${new Date(record.date).getFullYear()}`;
      if (!weeklyGroups[week]) weeklyGroups[week] = [];
      weeklyGroups[week].push(record);
    });

    const weeklyReports = Object.keys(weeklyGroups).map(week => ({
      label: week,
      ...calculateStats(weeklyGroups[week])
    })).sort((a, b) => b.label.localeCompare(a.label));

    const dayOrderGroups = {};
    records.forEach(record => {
      if (record.dayOrder) {
        if (!dayOrderGroups[record.dayOrder]) dayOrderGroups[record.dayOrder] = [];
        dayOrderGroups[record.dayOrder].push(record);
      }
    });

    const dayOrderReports = Object.keys(dayOrderGroups).map(order => ({
      label: order,
      ...calculateStats(dayOrderGroups[order])
    })).sort((a, b) => a.label.localeCompare(b.label));

    res.json({
      summary: overallSummary,
      weekly: weeklyReports,
      monthly: monthlyReports,
      dayOrderReports: dayOrderReports
    });
  } catch (error) {
    console.error('Error fetching attendance summary:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getSuggestedDayOrder = async (req, res) => {
  try {
    const latestRecord = await Attendance.findOne().sort({ date: -1 }).lean();
    if (latestRecord && latestRecord.dayOrder) {
      const lastOrder = latestRecord.dayOrder;
      const orderMap = { 'D1': 'D2', 'D2': 'D3', 'D3': 'D4', 'D4': 'D5', 'D5': 'D6', 'D6': 'D1' };
      return res.json({ suggestedDayOrder: orderMap[lastOrder] || 'D1' });
    }
    res.json({ suggestedDayOrder: 'D1' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── ADMIN RECORDS MANAGEMENT APIs ───

// Get all attendance batches
const getAttendanceRecords = async (req, res) => {
  try {
    const { department, semester, month, date, dayOrder } = req.query;
    let query = {};

    if (department) query.department = department;
    if (semester) query.semester = semester;
    if (date) query.date = date;
    if (dayOrder) query.dayOrder = dayOrder;
    if (month) {
      query.date = { $regex: `^${month}` }; // Matches YYYY-MM
    }

    const records = await Attendance.find(query).sort({ date: -1 });

    // Aggregate monthly summary if requested
    let summary = null;
    if (month && !date) {
      const totalDays = new Set(records.map(r => r.date)).size;
      const totalClasses = records.length;
      let totalStudentsCount = 0;
      let totalPresentPeriods = 0;
      let totalPeriods = 0;

      records.forEach(r => {
        totalStudentsCount += r.students.length;
        r.students.forEach(s => {
          totalPeriods += 5;
          if (s.periods) {
            s.periods.forEach(p => { if (p === 'present') totalPresentPeriods++; });
          }
        });
      });

      const avgAttendance = totalPeriods > 0 ? ((totalPresentPeriods / totalPeriods) * 100).toFixed(1) : 0;
      summary = { totalDays, totalClasses, totalStudentsCount, avgAttendance };
    }

    res.json({ records, summary });
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single attendance batch
const getAttendanceRecordById = async (req, res) => {
  try {
    const record = await Attendance.findById(req.params.id)
      .populate('students.studentId', 'name profile.admission.admissionNo email');
    
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update single attendance batch
const updateAttendanceRecord = async (req, res) => {
  try {
    const { students } = req.body;
    const record = await Attendance.findById(req.params.id);
    
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    // Update students periods
    record.students = students;
    await record.save();

    res.json({ message: 'Attendance record updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { 
  markAttendance, 
  getAttendanceHistory, 
  getAttendanceSummary, 
  getSuggestedDayOrder,
  getAttendanceRecords,
  getAttendanceRecordById,
  updateAttendanceRecord
};
