import { useState, useEffect } from 'react';
import API from '../services/api';
import { Check, X, Loader2, Calendar, Users, Filter, GraduationCap, Clock, Search, BookOpen, CheckCircle2, XCircle } from 'lucide-react';



const DEPARTMENTS = ['BCA', 'B.Sc CS', 'B.Com', 'BBA'];
const SEMESTERS = ['1st Semester', '2nd Semester', '3rd Semester', '4th Semester', '5th Semester', '6th Semester'];

const AttendancePage = () => {
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDayOrder, setSelectedDayOrder] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [search, setSearch] = useState('');

  const [attendance, setAttendance] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch suggested Day Order on mount
  useEffect(() => {
    const fetchSuggested = async () => {
      try {
        const res = await API.get('/attendance/suggested-day-order');
        if (res.data && res.data.suggestedDayOrder) {
          setSelectedDayOrder(res.data.suggestedDayOrder);
        }
      } catch (err) {
        console.error('Error fetching suggested day order', err);
      }
    };
    fetchSuggested();
  }, []);

  // Auto-fetch students when selection or date changes
  useEffect(() => {
    if (selectedDepartment && selectedSemester) {
      fetchStudents();
    } else {
      setStudents([]);
      setAttendance({});
    }
  }, [selectedDepartment, selectedSemester, date]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (selectedDepartment && selectedSemester) fetchStudents();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchStudents = async () => {
    if (!selectedDepartment || !selectedSemester) return;

    setLoading(true);
    setMessage('');
    try {
      const response = await API.get('/auth/students', {
        params: {
          course: selectedDepartment,
          semester: selectedSemester,
          search: search,
          limit: 200
        }
      });

      const studentsList = response.data.students || [];
      setStudents(studentsList);

      const initialAttendance = {};
      studentsList.forEach(s => {
        initialAttendance[s._id] = ['present', 'present', 'present', 'present', 'present'];
      });
      setAttendance(initialAttendance);

      if (studentsList.length === 0) {
        setMessage(search ? `Info: No students matching "${search}" in ${selectedDepartment} - ${selectedSemester}.` : `Info: No students found for ${selectedDepartment} - ${selectedSemester}.`);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setMessage('Error: Failed to load class register.');
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodToggle = (studentId, periodIndex) => {
    setAttendance(prev => {
      const newPeriods = [...prev[studentId]];
      newPeriods[periodIndex] = newPeriods[periodIndex] === 'present' ? 'absent' : 'present';
      return { ...prev, [studentId]: newPeriods };
    });
  };

  const handleFullDayStatus = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: Array(5).fill(status)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (students.length === 0) return;
    if (!selectedDayOrder) {
      setMessage('Error: Please select a Day Order before submitting.');
      return;
    }

    setSubmitting(true);
    setMessage('');

    try {
      const studentData = Object.keys(attendance).map(id => ({
        studentId: id,
        periods: attendance[id]
      }));

      await API.post('/attendance/mark', {
        date: date,
        dayOrder: selectedDayOrder,
        department: selectedDepartment,
        semester: selectedSemester.split(' ')[0], // e.g. "1st"
        students: studentData
      });

      setMessage('Success: Attendance batch saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error: Submission failed. Please check connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-0 space-y-5 sm:space-y-8">
      {/* Header */}
      <header className="space-y-4">
        <div className="text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Daily Attendance</h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">Manage class attendance registers with ease.</p>
        </div>
        <div className="flex flex-col min-[450px]:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 bg-white p-2 sm:p-2.5 border border-gray-200 rounded-xl shadow-sm flex-1 sm:flex-none">
            <Calendar size={14} className="text-primary ml-1 shrink-0" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border-none focus:ring-0 text-[10px] sm:text-[11px] font-black text-gray-700 outline-none uppercase tracking-widest cursor-pointer w-full bg-transparent"
            />
          </div>

          <div className="flex items-center gap-2 bg-white p-2 sm:p-2.5 border border-gray-200 rounded-xl shadow-sm flex-1 sm:flex-none relative">
            <BookOpen size={14} className="text-primary ml-1 shrink-0" />
            <select
              value={selectedDayOrder}
              onChange={(e) => setSelectedDayOrder(e.target.value)}
              className="border-none focus:ring-0 text-[10px] sm:text-[11px] font-black text-gray-700 outline-none uppercase tracking-widest cursor-pointer w-full bg-transparent pr-8 appearance-none"
            >
              <option value="" disabled>Day Order</option>
              {['D1', 'D2', 'D3', 'D4', 'D5', 'D6'].map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <Filter size={12} />
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="relative group">
          <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 ring-primary/10 focus:border-primary transition-all font-bold text-xs appearance-none shadow-sm cursor-pointer"
          >
            <option value="">Department</option>
            {DEPARTMENTS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <Filter size={14} />
          </div>
        </div>

        <div className="relative group">
          <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 ring-primary/10 focus:border-primary transition-all font-bold text-xs appearance-none shadow-sm cursor-pointer"
          >
            <option value="">Semester</option>
            {SEMESTERS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <Filter size={14} />
          </div>
        </div>

        <div className="relative group sm:col-span-2 lg:col-span-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 ring-primary/10 focus:border-primary transition-all font-bold text-xs shadow-sm"
          />
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-3 sm:p-4 rounded-xl text-xs font-bold border animate-in fade-in slide-in-from-top-2 ${message.includes('Success') ? 'bg-green-50 text-green-700 border-green-200' :
            message.includes('Error') ? 'bg-red-50 text-red-700 border-red-200' :
              'bg-blue-50 text-blue-700 border-blue-200'
          }`}>
          {message}
        </div>
      )}

      {/* Content */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-16 sm:p-24 text-center">
            <Loader2 size={36} className="animate-spin mx-auto text-primary mb-4" />
            <p className="text-xs font-black text-gray-400 uppercase tracking-[0.15em]">Synchronizing Class Data...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="p-16 sm:p-24 text-center text-gray-300">
            <Users size={48} className="mx-auto mb-4 opacity-10" />
            <p className="font-black uppercase tracking-[0.15em] text-xs">Select Department & Semester to Begin</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="animate-in fade-in duration-500">
            {/* ─── DESKTOP TABLE (hidden on smaller screens) ─── */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="table-header">Student Identity</th>
                    <th className="table-header text-center whitespace-nowrap">Quick Actions</th>
                    {[1, 2, 3, 4, 5].map(p => (
                      <th key={p} className="table-header text-center">Period {p}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map((student) => (
                    <tr key={student._id} className="hover:bg-gray-50 transition-colors group">
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                            <Users size={16} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-gray-900 leading-tight truncate">{student.name}</p>
                            <p className="text-[10px] text-gray-400 font-bold tracking-tight uppercase">{student.profile?.admission?.admissionNo}</p>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleFullDayStatus(student._id, 'present')}
                            className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                            title="Mark All Present"
                          >
                            <CheckCircle2 size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleFullDayStatus(student._id, 'absent')}
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                            title="Mark All Absent"
                          >
                            <XCircle size={16} />
                          </button>
                        </div>
                      </td>
                      {[0, 1, 2, 3, 4].map(idx => (
                        <td key={idx} className="table-cell text-center">
                          <button
                            type="button"
                            onClick={() => handlePeriodToggle(student._id, idx)}
                            className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all transform active:scale-95 ${attendance[student._id] && attendance[student._id][idx] === 'present'
                                ? 'bg-green-50 text-green-600 border-green-200 shadow-sm shadow-green-100'
                                : 'bg-red-50 text-red-600 border-red-200 shadow-sm shadow-red-100'
                              }`}
                          >
                            {attendance[student._id] && attendance[student._id][idx] === 'present' ? <Check size={18} strokeWidth={3} /> : <X size={18} strokeWidth={3} />}
                          </button>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ─── MOBILE/TABLET CARD VIEW (shown up to 1024px) ─── */}
            <div className="lg:hidden divide-y divide-gray-100">
              {students.map((student) => (
                <div key={student._id} className="p-4 sm:p-6">
                  {/* Student name row */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0 border border-primary/10">
                        <Users size={20} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-extrabold text-base text-gray-900 leading-tight truncate">{student.name}</p>
                        <p className="text-[11px] text-gray-400 font-black uppercase tracking-widest">{student.profile?.admission?.admissionNo}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleFullDayStatus(student._id, 'present')}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-green-50 text-green-700 rounded-xl text-[11px] font-black uppercase tracking-wide active:scale-95 hover:bg-green-100 transition-all border border-green-200"
                      >
                        <CheckCircle2 size={16} /> Full Present
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFullDayStatus(student._id, 'absent')}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-700 rounded-xl text-[11px] font-black uppercase tracking-wide active:scale-95 hover:bg-red-100 transition-all border border-red-200"
                      >
                        <XCircle size={16} /> Full Absent
                      </button>
                    </div>
                  </div>
                  {/* Period toggle grid */}
                  <div className="grid grid-cols-5 gap-2 sm:gap-4 lg:gap-6">
                    {[0, 1, 2, 3, 4].map(idx => (
                      <div key={idx} className="flex flex-col items-center gap-1.5">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">P{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handlePeriodToggle(student._id, idx)}
                          className={`w-full aspect-square max-w-[56px] rounded-xl border-2 flex items-center justify-center transition-all active:scale-90 ${attendance[student._id] && attendance[student._id][idx] === 'present'
                              ? 'bg-green-50 text-green-600 border-green-200'
                              : 'bg-red-50 text-red-600 border-red-200'
                            }`}
                        >
                          {attendance[student._id] && attendance[student._id][idx] === 'present'
                            ? <Check size={18} strokeWidth={3} />
                            : <X size={18} strokeWidth={3} />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="bg-gray-50/50 p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4 border-t border-gray-100">
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] text-center sm:text-left">
                Showing {students.length} Students
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full sm:w-auto sm:min-w-[200px] flex items-center justify-center gap-2 h-11 sm:h-12 shadow-xl shadow-primary/30 rounded-xl sm:rounded-2xl transform transition-all active:scale-95 text-xs sm:text-sm"
              >
                {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Confirm & Save'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AttendancePage;
