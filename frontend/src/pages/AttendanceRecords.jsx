import { useState, useEffect } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Eye, Search, Filter, Loader2, CheckCircle2, GraduationCap, Clock } from 'lucide-react';



const AttendanceRecords = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [month, setMonth] = useState(new Date().toISOString().substring(0, 7)); // YYYY-MM
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('');
  const [dayOrder, setDayOrder] = useState('');
  const [dateSearch, setDateSearch] = useState('');

  useEffect(() => {
    fetchRecords();
  }, [month, department, semester, dayOrder, dateSearch]);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const params = {};
      if (month) params.month = month;
      if (department) params.department = department;
      if (semester) params.semester = semester;
      if (dayOrder) params.dayOrder = dayOrder;
      if (dateSearch) params.date = dateSearch;

      const res = await API.get('/attendance/records', { params });
      setRecords(res.data.records);
      setSummary(res.data.summary);
    } catch (error) {
      console.error('Error fetching records', error);
    } finally {
      setLoading(false);
    }
  };

  const SummaryCard = ({ icon: Icon, label, value, colorClass }) => (
    <div className="bg-white p-3 sm:p-5 lg:p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 transition-all hover:shadow-md">
      <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      <div className="text-center sm:text-left min-w-0 w-full">
        <p className="text-[7px] min-[380px]:text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className="text-sm min-[380px]:text-lg sm:text-2xl font-black text-gray-900 leading-tight break-words">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4 sm:space-y-6 overflow-x-hidden px-1 sm:px-0 pb-12">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Attendance Records</h1>
          <p className="text-xs sm:text-sm text-gray-500">Manage and verify completed attendance batches.</p>
        </div>
      </header>

      {/* Summary Cards */}
      {summary && month && !dateSearch && (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom-4">
          <SummaryCard icon={Calendar} label="Working Days" value={summary.totalDays} colorClass="bg-blue-50 text-blue-500" />
          <SummaryCard icon={Clock} label="Classes" value={summary.totalClasses} colorClass="bg-purple-50 text-purple-500" />
          <SummaryCard icon={Users} label="Students" value={summary.totalStudentsCount} colorClass="bg-orange-50 text-orange-500" />
          <SummaryCard icon={CheckCircle2} label="Avg Attnd." value={`${summary.avgAttendance}%`} colorClass="bg-green-50 text-green-500" />
        </div>
      )}

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="date"
              value={dateSearch}
              onChange={(e) => { setDateSearch(e.target.value); setMonth(''); }}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm shadow-sm outline-none focus:ring-2 ring-primary/20"
            />
          </div>
          <div className="flex-1 relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="month"
              value={month}
              onChange={(e) => { setMonth(e.target.value); setDateSearch(''); }}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm shadow-sm outline-none focus:ring-2 ring-primary/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          <div className="relative">
            <select value={department} onChange={e => setDepartment(e.target.value)} className="w-full pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold shadow-sm outline-none appearance-none cursor-pointer focus:ring-2 ring-primary/10">
              <option value="">All Departments</option>
              {['BCA', 'B.Sc CS', 'B.Com', 'BBA'].map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select value={semester} onChange={e => setSemester(e.target.value)} className="w-full pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold shadow-sm outline-none appearance-none cursor-pointer focus:ring-2 ring-primary/10">
              <option value="">All Semesters</option>
              {['1st', '2nd', '3rd', '4th', '5th', '6th'].map(s => <option key={s} value={s}>{s} Semester</option>)}
            </select>
            <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative sm:col-span-2 xl:col-span-1">
            <select value={dayOrder} onChange={e => setDayOrder(e.target.value)} className="w-full pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold shadow-sm outline-none appearance-none cursor-pointer focus:ring-2 ring-primary/10">
              <option value="">All Day Orders</option>
              {['D1', 'D2', 'D3', 'D4', 'D5', 'D6'].map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Records Section */}
      <div className="card overflow-hidden">
        {/* ─── DESKTOP TABLE (shown on large screens 1280px+) ─── */}
        <div className="hidden xl:block overflow-x-auto scrollbar-hide">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="table-header">Date</th>
                <th className="table-header">Day Order</th>
                <th className="table-header">Class</th>
                <th className="table-header text-center">Students</th>
                <th className="table-header text-center">Status</th>
                <th className="table-header text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-16 text-center">
                    <Loader2 size={32} className="animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Synchronizing Records...</p>
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-16 text-center text-gray-300">
                    <p className="font-black uppercase tracking-widest text-[10px]">No records matching filters</p>
                  </td>
                </tr>
              ) : records.map(record => (
                <tr key={record._id} className="hover:bg-gray-50 transition-colors group">
                  <td className="table-cell">
                    <span className="text-sm font-black text-gray-900">{new Date(record.date).toLocaleDateString()}</span>
                  </td>
                  <td className="table-cell">
                    <span className="px-2.5 py-1 bg-gray-100 text-[10px] font-black text-gray-600 rounded-lg uppercase">{record.dayOrder}</span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <GraduationCap size={16} className="text-gray-400" />
                      <div>
                        <p className="text-sm font-black text-gray-900 leading-tight">{record.department}</p>
                        <p className="text-[10px] font-bold text-gray-500 uppercase">{record.semester} Sem</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell text-center">
                    <span className="text-xs font-bold text-gray-700">{record.students.length} Total</span>
                  </td>
                  <td className="table-cell text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      record.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="table-cell text-right">
                    <button 
                      onClick={() => navigate(`/admin/attendance-records/${record._id}`)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 hover:text-primary hover:border-primary/30 rounded-xl text-[10px] font-black uppercase transition-all shadow-sm"
                    >
                      <Eye size={14} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ─── MOBILE/TABLET CARD VIEW (shown below 1280px) ─── */}
        <div className="xl:hidden divide-y divide-gray-100">
          {loading ? (
            <div className="p-12 text-center text-gray-400">
              <Loader2 size={24} className="animate-spin mx-auto mb-2 text-primary" />
              <p className="text-[9px] font-black uppercase tracking-widest">Loading Records...</p>
            </div>
          ) : records.length === 0 ? (
            <div className="p-12 text-center text-gray-300">
              <p className="font-black uppercase tracking-widest text-[9px]">No records found</p>
            </div>
          ) : records.map(record => (
            <div key={record._id} className="p-4 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-0.5">{new Date(record.date).toLocaleDateString()}</p>
                  <h3 className="text-sm font-black text-gray-900 leading-tight truncate">{record.department} - {record.semester}</h3>
                </div>
                <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${
                  record.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {record.status}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-lg border border-gray-100">
                  <Clock size={10} className="text-gray-400" />
                  <span className="text-[9px] font-black text-gray-600 uppercase">{record.dayOrder}</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-lg border border-gray-100">
                  <Users size={10} className="text-gray-400" />
                  <span className="text-[9px] font-black text-gray-600 uppercase">{record.students.length} Students</span>
                </div>
                <button 
                  onClick={() => navigate(`/admin/attendance-records/${record._id}`)}
                  className="ml-auto p-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all border border-primary/20"
                >
                  <Eye size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttendanceRecords;
