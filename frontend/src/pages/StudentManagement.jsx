import { useState, useEffect } from 'react';
import API from '../services/api';
import { UserPlus, Edit2, Loader2, UserCircle, Trash2, Search, Filter, ChevronLeft, ChevronRight, GraduationCap, Calendar, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentManagement = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Pagination & Filter States
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [search, setSearch] = useState('');
  const [course, setCourse] = useState('');
  const [semester, setSemester] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [limit] = useState(10);

  useEffect(() => {
    fetchStudents();
  }, [page, course, semester, academicYear]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page !== 1) setPage(1);
      else fetchStudents();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await API.get('/auth/students', {
        params: { page, limit, search, course, semester, academicYear }
      });
      setStudents(response.data.students);
      setTotalPages(response.data.pages);
      setTotalStudents(response.data.total);
    } catch (error) {
      console.error('Error fetching students:', error);
      setMessage('Failed to load students.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This will permanently remove their records.`)) {
      try {
        await API.delete(`/auth/students/${id}`);
        setMessage('Student deleted successfully.');
        fetchStudents();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Error deleting student.');
      }
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4 sm:space-y-6 overflow-x-hidden px-1 sm:px-0">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-1">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Student Management</h1>
          <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Registry Overview</p>
        </div>
        <button
          onClick={() => navigate('/admin/students/add')}
          className="btn-primary flex items-center gap-2 px-6 py-3 shadow-xl shadow-primary/10 text-xs w-full sm:w-auto justify-center active:scale-95 transition-transform"
        >
          <UserPlus size={16} />
          <span className="font-black uppercase tracking-widest">New Admission</span>
        </button>
      </header>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-xl text-xs font-black uppercase tracking-wider border animate-in fade-in slide-in-from-top-2 mx-1 ${
          message.includes('successfully') ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
        }`}>
          {message}
        </div>
      )}

      {/* Filters Section */}
      <div className="space-y-3 px-1">
        {/* Search */}
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={14} />
          <input
            type="text"
            placeholder="Search student identity..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-4 ring-primary/5 transition-all font-bold text-xs shadow-sm"
          />
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full pl-8 pr-2 py-2.5 bg-white border border-gray-200 rounded-xl outline-none text-[10px] font-black uppercase tracking-tighter appearance-none cursor-pointer shadow-sm"
            >
              <option value="">Courses</option>
              {['BCA', 'B.Sc CS', 'B.Com', 'BBA'].map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="relative">
            <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full pl-8 pr-2 py-2.5 bg-white border border-gray-200 rounded-xl outline-none text-[10px] font-black uppercase tracking-tighter appearance-none cursor-pointer shadow-sm"
            >
              <option value="">Semester</option>
              {['1st Semester', '2nd Semester', '3rd Semester', '4th Semester', '5th Semester', '6th Semester'].map(s => (
                <option key={s} value={s}>{s.split(' ')[0]}</option>
              ))}
            </select>
          </div>
          <div className="relative col-span-2 lg:col-span-1">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full pl-8 pr-2 py-2.5 bg-white border border-gray-200 rounded-xl outline-none text-[10px] font-black uppercase tracking-tighter appearance-none cursor-pointer shadow-sm"
            >
              <option value="">Batch / Year</option>
              {['2022-2025', '2023-2026', '2024-2027'].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between px-1">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{totalStudents} Total Records</span>
          {loading && <Loader2 size={12} className="animate-spin text-primary" />}
        </div>
      </div>

      {/* ─── DESKTOP TABLE (1280px+) ─── */}
      <div className="hidden xl:block card overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="table-header">Student</th>
                <th className="table-header">Admission No</th>
                <th className="table-header">Group / Course</th>
                <th className="table-header text-center">Semester</th>
                <th className="table-header text-center">Year</th>
                <th className="table-header text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {!loading && students.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200 shrink-0 overflow-hidden">
                        {student.profile?.personal?.photo ? (
                          <img src={student.profile.personal.photo} className="w-full h-full object-cover" />
                        ) : (
                          <UserCircle size={20} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 leading-tight truncate">{student.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold truncate lowercase">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell font-mono text-[10px] font-black text-primary/70">{student.profile?.admission?.admissionNo || 'N/A'}</td>
                  <td className="table-cell">
                    <span className="px-2.5 py-0.5 bg-gray-100 text-[10px] font-black text-gray-600 rounded-md uppercase">{student.profile?.admission?.course || 'UNSET'}</span>
                  </td>
                  <td className="table-cell text-center">
                    <span className="text-[10px] font-black text-blue-600 uppercase">{student.profile?.admission?.semester?.split(' ')[0] || 'N/A'}</span>
                  </td>
                  <td className="table-cell text-center font-bold text-gray-400 text-[10px]">{student.profile?.admission?.academicYear || 'N/A'}</td>
                  <td className="table-cell text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => navigate(`/admin/students/${student._id}`)} className="text-gray-300 hover:text-blue-600 p-2 rounded-lg transition-all"><Eye size={16} /></button>
                      <button onClick={() => navigate(`/admin/students/edit/${student._id}`)} className="text-gray-300 hover:text-primary p-2 rounded-lg transition-all"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(student._id, student.name)} className="text-gray-300 hover:text-red-600 p-2 rounded-lg transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && (
            <div className="p-20 text-center">
              <Loader2 size={32} className="animate-spin mx-auto text-primary mb-4" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Refreshing Ledger...</p>
            </div>
          )}
          {!loading && students.length === 0 && (
            <div className="p-20 text-center text-gray-300 font-black uppercase tracking-widest text-[10px]">No records match your search</div>
          )}
        </div>
      </div>

      {/* ─── MOBILE/TABLET CARDS (<1280px) ─── */}
      <div className="xl:hidden space-y-3 px-1">
        {loading ? (
          <div className="card p-12 text-center bg-white/50 border-dashed">
            <Loader2 size={24} className="animate-spin mx-auto text-primary mb-2 opacity-50" />
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Updating View...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="card p-12 text-center bg-gray-50/50 border-dashed text-gray-400 font-black uppercase tracking-widest text-[9px]">No students found</div>
        ) : students.map((student) => (
          <div key={student._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-4 relative overflow-hidden transition-all active:scale-[0.98]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 border border-gray-100 shrink-0 overflow-hidden shadow-inner">
                  {student.profile?.personal?.photo ? (
                    <img src={student.profile.personal.photo} className="w-full h-full object-cover" />
                  ) : (
                    <UserCircle size={24} />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-black text-[13px] text-gray-900 leading-none truncate">{student.name}</h3>
                  <p className="text-[10px] text-gray-400 font-bold truncate lowercase mt-1.5">{student.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0 bg-gray-50/50 p-1 rounded-xl border border-gray-100">
                <button onClick={() => navigate(`/admin/students/${student._id}`)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-all rounded-lg"><Eye size={15} /></button>
                <button onClick={() => navigate(`/admin/students/edit/${student._id}`)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-primary transition-all rounded-lg"><Edit2 size={15} /></button>
                <button onClick={() => handleDelete(student._id, student.name)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-600 transition-all rounded-lg"><Trash2 size={15} /></button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[9px] font-black rounded uppercase tracking-tighter border border-gray-200">{student.profile?.admission?.course || 'N/A'}</span>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-black rounded uppercase tracking-tighter border border-blue-100">{student.profile?.admission?.semester?.split(' ')[0] || 'N/A'} SEM</span>
              <span className="px-2 py-0.5 bg-gray-50 text-gray-500 text-[9px] font-bold rounded border border-gray-100">{student.profile?.admission?.academicYear || 'N/A'}</span>
              {student.profile?.admission?.admissionNo && (
                <span className="ml-auto text-[9px] font-mono font-black text-primary/40 tracking-widest">#{student.profile.admission.admissionNo}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 py-6 px-1">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-10 h-10 flex items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-600 disabled:opacity-20 hover:bg-gray-50 shadow-sm transition-all"><ChevronLeft size={20} /></button>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) pageNum = i + 1;
              else if (page <= 3) pageNum = i + 1;
              else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = page - 2 + i;
              return (
                <button key={pageNum} onClick={() => setPage(pageNum)} className={`w-10 h-10 rounded-2xl text-[11px] font-black transition-all ${page === pageNum ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-110' : 'bg-white border border-gray-100 text-gray-400 hover:text-primary'}`}>{pageNum}</button>
              );
            })}
          </div>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-10 h-10 flex items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-600 disabled:opacity-20 hover:bg-gray-50 shadow-sm transition-all"><ChevronRight size={20} /></button>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
