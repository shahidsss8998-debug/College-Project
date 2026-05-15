import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  User as UserIcon, Mail, GraduationCap, MapPin,
  Phone, Hash, Briefcase, BadgeCheck, ChevronLeft,
  Calendar, Clock, AlertTriangle, FileText, Download, Building2, Check, X
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const AdminStudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}/auth/students/${id}/full-profile`);
        setData(res.data);
      } catch (error) {
        console.error('Error fetching student profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Loading Full Profile...</p>
    </div>
  );

  if (!data || !data.student) return (
    <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
      <AlertTriangle size={48} className="text-red-400 mb-4 opacity-50" />
      <p className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Student Not Found</p>
      <button onClick={() => navigate(-1)} className="text-primary text-xs font-bold hover:underline">Go Back</button>
    </div>
  );

  const { student, attendance, events } = data;
  const isShortage = parseFloat(attendance.percentage) < 75;

  const Field = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-4 py-3">
      <div className="w-9 h-9 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center shrink-0">
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
        <p className={`text-sm font-semibold ${value && value !== 'N/A' ? 'text-gray-800' : 'text-gray-300'}`}>
          {value || 'Not Provided'}
        </p>
      </div>
    </div>
  );

  // Group history by month for the report section
  const groupHistoryByMonth = (historyArray) => {
    const grouped = {};
    historyArray.forEach(record => {
      const dateObj = new Date(record.date);
      const monthKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
      if (!grouped[monthKey]) grouped[monthKey] = [];
      grouped[monthKey].push(record);
    });
    return grouped;
  };

  const groupedHistory = groupHistoryByMonth(attendance.history);
  const monthlyStats = Object.keys(groupedHistory).map(monthStr => {
    const records = groupedHistory[monthStr];
    let monthPresent = 0;
    let monthTotal = 0;
    records.forEach(r => {
      r.periods.forEach(p => {
        monthTotal++;
        if (p === 'present') monthPresent++;
      });
    });
    const date = new Date(monthStr + '-01');
    const monthName = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    return {
      monthKey: monthStr,
      label: monthName,
      present: monthPresent,
      total: monthTotal,
      percentage: monthTotal > 0 ? ((monthPresent / monthTotal) * 100).toFixed(1) : '0.0'
    };
  }).sort((a, b) => b.monthKey.localeCompare(a.monthKey));

  const formatDateShort = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <header className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary/30 transition-all shadow-sm"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Student Profile</h1>
          <p className="text-sm text-gray-500 font-medium">Viewing full ERP records for {student.name}</p>
        </div>
      </header>

      {/* ─── Personal Details Card ─── */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary via-secondary to-primary"></div>
        <div className="p-8 sm:p-10 border-b border-gray-50 flex flex-col sm:flex-row items-center sm:items-start gap-8">
          <div className="w-32 h-32 rounded-2xl bg-gray-50 border-2 border-gray-100 flex items-center justify-center overflow-hidden shrink-0 shadow-sm relative">
            {student.profile?.personal?.photo ? (
              <img src={student.profile.personal.photo} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <UserIcon size={48} className="text-gray-300" />
            )}
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
          <div className="flex-1 text-center sm:text-left space-y-3">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">{student.name}</h2>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-6 text-sm">
              <div className="flex items-center gap-2 text-gray-500 font-semibold">
                <Mail size={16} className="text-gray-400" />
                {student.email}
              </div>
              <div className="flex items-center gap-2 text-gray-500 font-semibold">
                <Phone size={16} className="text-gray-400" />
                {student.profile?.personal?.contactNumber || 'No Contact'}
              </div>
            </div>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-2">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide uppercase">
                {student.profile?.admission?.course || 'No Course'}
              </span>
              <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold tracking-wide uppercase">
                Sem {student.profile?.admission?.semester || 'N/A'}
              </span>
              <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold tracking-wide uppercase">
                {student.profile?.admission?.academicYear || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Grids */}
        <div className="p-8 sm:p-10 grid md:grid-cols-2 gap-x-12 gap-y-10">
          <div>
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Personal Details</h3>
            <div className="space-y-1">
              <Field icon={Calendar} label="Date of Birth" value={student.profile?.personal?.dob ? new Date(student.profile.personal.dob).toLocaleDateString() : ''} />
              <Field icon={UserIcon} label="Gender" value={student.profile?.personal?.gender} />
              <Field icon={BadgeCheck} label="Blood Group" value={student.profile?.personal?.bloodGroup} />
            </div>
          </div>
          <div>
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Parent Details</h3>
            <div className="space-y-1">
              <Field icon={UserIcon} label="Father Name" value={student.profile?.parent?.fatherName} />
              <Field icon={UserIcon} label="Mother Name" value={student.profile?.parent?.motherName} />
              <Field icon={Briefcase} label="Occupation" value={student.profile?.parent?.occupation} />
            </div>
          </div>
          <div>
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Contact & Address</h3>
            <div className="space-y-1">
              <Field icon={MapPin} label="Current Address" value={student.profile?.address?.currentAddress} />
              <Field icon={Building2} label="City / State" value={`${student.profile?.address?.city || ''}, ${student.profile?.address?.state || ''}`} />
            </div>
          </div>
          <div>
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Academic & Admission</h3>
            <div className="space-y-1">
              <Field icon={GraduationCap} label="Previous School/College" value={student.profile?.academic?.previousSchool} />
              <Field icon={Hash} label="Admission Number" value={student.profile?.admission?.admissionNumber} />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Attendance Summary ─── */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
          <Calendar size={20} className="text-primary" />
          Attendance Overview
        </h2>
        {isShortage && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center gap-3 animate-in fade-in">
            <AlertTriangle size={20} className="text-red-500 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-red-800">Attendance Shortage Warning</h3>
              <p className="text-xs text-red-600 font-medium">This student's attendance is critically low ({attendance.percentage}%). Minimum requirement is 75%.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 mb-4">
              <Clock size={20} />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Periods</p>
            <p className="text-3xl font-black text-gray-900 mt-1">{attendance.total}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-500 mb-4 relative z-10">
              <Check size={20} className="stroke-[3]" />
            </div>
            <p className="text-[10px] font-black text-green-600/70 uppercase tracking-widest relative z-10">Present</p>
            <p className="text-3xl font-black text-green-600 mt-1 relative z-10">{attendance.present}</p>
            <div className="absolute -right-4 -bottom-4 opacity-5">
              <Check size={100} className="stroke-[3]" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 mb-4 relative z-10">
              <X size={20} className="stroke-[3]" />
            </div>
            <p className="text-[10px] font-black text-red-600/70 uppercase tracking-widest relative z-10">Absent</p>
            <p className="text-3xl font-black text-red-600 mt-1 relative z-10">{attendance.absent}</p>
            <div className="absolute -right-4 -bottom-4 opacity-5">
              <X size={100} className="stroke-[3]" />
            </div>
          </div>
          <div className={`p-6 rounded-2xl border shadow-sm flex flex-col justify-between relative overflow-hidden ${isShortage ? 'bg-red-500 border-red-600' : 'bg-primary border-primary-dark'
            }`}>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white mb-4 relative z-10">
              <GraduationCap size={20} />
            </div>
            <p className="text-[10px] font-black text-white/80 uppercase tracking-widest relative z-10">Percentage</p>
            <p className="text-3xl font-black text-white mt-1 relative z-10">{attendance.percentage}%</p>
            <div className="absolute -right-2 -bottom-2 opacity-10">
              <GraduationCap size={100} />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Detailed History & Monthly Report & Events ─── */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Height is strictly driven by the right column */}
        <div className="lg:col-span-2 relative min-h-[400px]">
          <div className="absolute inset-0 flex flex-col space-y-4">
            <div className="flex items-center gap-2 shrink-0">
              <Clock size={16} className="text-primary" />
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Attendance History (P1-P5)</h2>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex-1 flex flex-col">
              <div className="overflow-y-auto flex-1">
                <table className="w-full">
                  <thead className="sticky top-0 bg-gray-50 shadow-sm z-10">
                    <tr>
                      <th className="px-4 py-3 text-left text-[10px] font-black text-gray-400 uppercase">Date</th>
                      {[1, 2, 3, 4, 5].map(p => (
                        <th key={p} className="px-2 py-3 text-center text-[10px] font-black text-gray-400 uppercase">P{p}</th>
                      ))}
                      <th className="px-4 py-3 text-center text-[10px] font-black text-gray-400 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {attendance.history.slice(0, 30).map((record, i) => {
                      const dayTotal = record.periods.filter(p => p === 'present').length;
                      return (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-xs font-bold text-gray-800">{formatDateShort(record.date)}</td>
                          {record.periods.map((p, idx) => (
                            <td key={idx} className="px-2 py-3 text-center">
                              <div className={`mx-auto w-5 h-5 rounded-full flex items-center justify-center ${p === 'present' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                }`}>
                                {p === 'present' ? <Check size={10} strokeWidth={4} /> : <X size={10} strokeWidth={4} />}
                              </div>
                            </td>
                          ))}
                          <td className="px-4 py-3 text-center">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-black ${dayTotal >= 3 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                              {dayTotal}/5
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {attendance.history.length === 0 && (
                  <div className="p-8 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">No history available</div>
                )}
              </div>
              {attendance.history.length > 30 && (
                <div className="p-3 bg-gray-50 text-center text-xs font-bold text-gray-500 border-t border-gray-100 shrink-0">
                  Showing last 30 records
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Dictates the height of the row */}
        <div className="space-y-6">
          {/* Monthly Summary */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-primary" />
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Monthly Summary</h2>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead><tr className="bg-gray-50/50">
                  <th className="px-4 py-3 text-left text-[10px] font-black text-gray-400 uppercase">Month</th>
                  <th className="px-4 py-3 text-right text-[10px] font-black text-gray-400 uppercase">%</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {monthlyStats.map((stat, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-xs font-bold text-gray-700">{stat.label}</td>
                      <td className="px-4 py-4 text-right">
                        <span className={`text-xs font-black ${parseFloat(stat.percentage) >= 75 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {stat.percentage}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {monthlyStats.length === 0 && (
                <p className="p-8 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">No Data</p>
              )}
            </div>
          </div>

          {/* Registered Events */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-primary" />
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Registered Events ({events?.length || 0})</h2>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
              {events && events.length > 0 ? events.map(e => (
                <div key={e._id} className="border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                  <h4 className="text-sm font-bold text-gray-900">{e.title}</h4>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">{new Date(e.date).toLocaleDateString()}</p>
                </div>
              )) : (
                <p className="text-xs text-gray-400 font-bold text-center py-2 uppercase tracking-widest">No Events</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminStudentProfile;
