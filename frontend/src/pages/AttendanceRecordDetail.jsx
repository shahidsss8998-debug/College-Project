import { useState, useEffect } from 'react';
import API from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Save, GraduationCap, Calendar, Clock, CheckCircle } from 'lucide-react';



const AttendanceRecordDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchRecord();
  }, [id]);

  const fetchRecord = async () => {
    try {
      const res = await API.get(`/attendance/records/${id}`);
      setRecord(res.data);
      setStudents(res.data.students || []);
    } catch (error) {
      console.error('Error fetching record', error);
      setMessage('Failed to load record details.');
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodToggle = (studentIndex, periodIndex) => {
    const updatedStudents = [...students];
    const currentPeriod = updatedStudents[studentIndex].periods[periodIndex];
    updatedStudents[studentIndex].periods[periodIndex] = currentPeriod === 'present' ? 'absent' : 'present';
    setStudents(updatedStudents);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      // Clean up students array to only include IDs, stripping out populated objects if any
      const payload = students.map(s => ({
        studentId: s.studentId._id || s.studentId,
        periods: s.periods
      }));

      await API.put(`/attendance/records/${id}`, { students: payload });
      setMessage('Record updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating record', error);
      setMessage('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 size={40} className="animate-spin text-primary" />
        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Loading Record...</p>
      </div>
    );
  }

  if (!record) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8 pb-12">
      <button 
        onClick={() => navigate('/admin/attendance-records')}
        className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors"
      >
        <ArrowLeft size={16} /> Back to Records
      </button>

      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm transition-all">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Record Detail</h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[10px] sm:text-xs font-bold text-gray-500">
            <span className="flex items-center gap-1 uppercase tracking-wider"><Calendar size={13} className="text-primary" /> {new Date(record.date).toLocaleDateString()}</span>
            <span className="flex items-center gap-1 uppercase tracking-wider"><Clock size={13} className="text-primary" /> {record.dayOrder}</span>
            <span className="flex items-center gap-1 uppercase tracking-wider"><GraduationCap size={13} className="text-primary" /> {record.department} ({record.semester} Sem)</span>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex items-center justify-center gap-2 px-6 py-2.5 w-full sm:w-auto shadow-lg shadow-primary/10 transition-all active:scale-95"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          <span className="font-black uppercase tracking-widest text-[10px]">Save Changes</span>
        </button>
      </header>

      {message && (
        <div className={`p-3 rounded-xl text-[10px] font-black flex items-center gap-2 animate-in fade-in slide-in-from-top-1 ${
          message.includes('success') ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
        }`}>
          {message.includes('success') ? <CheckCircle size={14} /> : null}
          {message.toUpperCase()}
        </div>
      )}

      <div className="card overflow-hidden">
        {/* ─── DESKTOP TABLE (shown on large screens 1280px+) ─── */}
        <div className="hidden xl:block overflow-x-auto scrollbar-hide">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="table-header">Student Identity</th>
                {[1, 2, 3, 4, 5].map(p => (
                  <th key={p} className="table-header text-center">P{p}</th>
                ))}
                <th className="table-header text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.map((student, sIndex) => {
                const isPopulated = student.studentId && student.studentId.name;
                const name = isPopulated ? student.studentId.name : 'Unknown Student';
                const admissionNo = isPopulated && student.studentId.profile ? student.studentId.profile.admission.admissionNo : 'N/A';
                const presentCount = student.periods.filter(p => p === 'present').length;

                return (
                  <tr key={sIndex} className="hover:bg-gray-50 transition-colors">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 shrink-0 text-gray-400 font-black text-[10px]">
                          {name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 leading-tight truncate">{name}</p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{admissionNo}</p>
                        </div>
                      </div>
                    </td>
                    {student.periods.map((status, pIndex) => (
                      <td key={pIndex} className="table-cell text-center">
                        <button
                          onClick={() => handlePeriodToggle(sIndex, pIndex)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-[9px] font-black transition-all mx-auto border-2 ${
                            status === 'present' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm' 
                              : 'bg-red-50 text-red-700 border-red-200 shadow-sm'
                          }`}
                        >
                          {status === 'present' ? 'P' : 'A'}
                        </button>
                      </td>
                    ))}
                    <td className="table-cell text-center">
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black tracking-widest uppercase ${
                        presentCount >= 3 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {presentCount}/5
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ─── MOBILE/TABLET CARD VIEW (shown below 1280px) ─── */}
        <div className="xl:hidden divide-y divide-gray-100">
          {students.map((student, sIndex) => {
            const isPopulated = student.studentId && student.studentId.name;
            const name = isPopulated ? student.studentId.name : 'Unknown Student';
            const admissionNo = isPopulated && student.studentId.profile ? student.studentId.profile.admission.admissionNo : 'N/A';
            const presentCount = student.periods.filter(p => p === 'present').length;

            return (
              <div key={sIndex} className="p-4 flex flex-col gap-3 transition-all hover:bg-gray-50/50">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0 text-gray-400 font-black text-[10px]">
                      {name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-xs text-gray-900 leading-tight truncate">{name}</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{admissionNo}</p>
                    </div>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${
                    presentCount >= 3 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {presentCount}/5
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {student.periods.map((status, pIndex) => (
                    <div key={pIndex} className="flex flex-col items-center gap-1">
                      <span className="text-[8px] font-black text-gray-300 uppercase">P{pIndex + 1}</span>
                      <button
                        onClick={() => handlePeriodToggle(sIndex, pIndex)}
                        className={`w-full aspect-square max-w-[40px] rounded-lg flex items-center justify-center text-[9px] font-black transition-all border-2 ${
                          status === 'present' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        {status === 'present' ? 'P' : 'A'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AttendanceRecordDetail;
