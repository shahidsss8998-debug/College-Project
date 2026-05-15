import { useContext, useState, useEffect } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, Percent, Calendar, Info, ChevronRight } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState({
    summary: { totalPeriods: 0, present: 0, absent: 0, percentage: 0 },
    weekly: [],
    monthly: []
  });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        try {
          const [summaryRes, historyRes] = await Promise.all([
            API.get(`/attendance/summary/${user.id}`),
            API.get(`/attendance/history/${user.id}`)
          ]);
          setData(summaryRes.data);
          setHistory(historyRes.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [user]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Compiling Attendance Data...</p>
    </div>
  );

  const percentage = parseFloat(data.summary.percentage);
  const isShortage = percentage < 75;

  const summaryCards = [
    { name: 'Working Days', value: `${data.summary.daysPresent || 0} / ${data.summary.totalWorkingDays || 90}`, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Total Periods', value: data.summary.totalPeriods || 0, icon: Clock, color: 'text-primary', bg: 'bg-primary/10' },
    { name: 'Present Periods', value: data.summary.presentPeriods || 0, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { name: 'Overall Attendance', value: `${percentage}%`, icon: Percent, color: isShortage ? 'text-red-600' : 'text-accent-dark', bg: isShortage ? 'bg-red-50' : 'bg-accent/10' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Attendance Analytics</h1>
          <p className="text-sm text-gray-500 font-medium">Verified academic records for {user?.name}</p>
        </div>
        {isShortage && (
          <div className="bg-red-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-2xl shadow-xl shadow-red-200 flex items-center gap-2 sm:gap-3 animate-pulse">
            <Info size={18} />
            <span className="text-xs font-black uppercase tracking-widest">Attendance Shortage Warning</span>
          </div>
        )}
      </header>

      {/* Summary Section */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {summaryCards.map((card, i) => (
          <div key={i} className="bg-white p-3 sm:p-5 lg:p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4">
            <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl ${card.bg} ${card.color} flex items-center justify-center shrink-0`}>
              <card.icon className="w-5 h-5 sm:w-6" strokeWidth={2.5} />
            </div>
            <div className="text-center sm:text-left min-w-0 w-full">
              <p className="text-[7px] min-[380px]:text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{card.name}</p>
              <h3 className={`text-sm min-[380px]:text-lg sm:text-2xl font-black ${card.color} leading-tight break-words`}>{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Reports Side */}
        <div className="lg:col-span-1 space-y-6 lg:space-y-8">
          {/* Weekly Report */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-primary" />
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Weekly Performance</h2>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead><tr className="bg-gray-50/50">
                  <th className="px-3 sm:px-4 py-3 text-left text-[10px] font-black text-gray-400 uppercase">Week</th>
                  <th className="px-3 sm:px-4 py-3 text-center text-[10px] font-black text-gray-400 uppercase">P/T</th>
                  <th className="px-3 sm:px-4 py-3 text-right text-[10px] font-black text-gray-400 uppercase">%</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {data.weekly.slice(0, 5).map((week, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs font-bold text-gray-700">{week.label}</td>
                      <td className="px-3 sm:px-4 py-3 sm:py-4 text-center text-xs font-bold text-gray-500">{week.presentPeriods}/{week.totalPeriods}</td>
                      <td className="px-3 sm:px-4 py-3 sm:py-4 text-right">
                        <span className={`text-xs font-black ${week.percentage >= 75 ? 'text-emerald-600' : 'text-red-600'}`}>{week.percentage}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {data.weekly.length === 0 && <p className="p-8 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">No Data</p>}
            </div>
          </div>

          {/* Monthly Report */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-primary" />
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Monthly Summary</h2>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead><tr className="bg-gray-50/50">
                  <th className="px-4 py-3 text-left text-[10px] font-black text-gray-400 uppercase">Month</th>
                  <th className="px-4 py-3 text-center text-[10px] font-black text-gray-400 uppercase">P/T</th>
                  <th className="px-4 py-3 text-right text-[10px] font-black text-gray-400 uppercase">%</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {data.monthly.map((month, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 text-xs font-bold text-gray-700">{month.label}</td>
                      <td className="px-4 py-4 text-center text-xs font-bold text-gray-500">{month.presentPeriods}/{month.totalPeriods}</td>
                      <td className="px-4 py-4 text-right">
                        <span className={`text-xs font-black ${month.percentage >= 75 ? 'text-emerald-600' : 'text-red-600'}`}>{month.percentage}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Detailed History */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-primary" />
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Attendance History (P1-P5)</h2>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Date</th>
                  {[1, 2, 3, 4, 5].map(p => (
                    <th key={p} className="px-2 py-4 text-center text-[10px] font-black text-gray-400 uppercase">P{p}</th>
                  ))}
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-[10px] font-black text-gray-400 uppercase whitespace-nowrap">Status</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {history.slice(0, 5).map((record, i) => {
                    const presentCount = record.periods.filter(p => p === 'present').length;
                    return (
                      <tr key={i} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs font-black text-gray-700 whitespace-nowrap">{record.date}</td>
                        {record.periods.map((p, idx) => (
                          <td key={idx} className="px-2 py-4 text-center">
                            <div className={`w-5 h-5 sm:w-6 sm:h-6 mx-auto rounded-md flex items-center justify-center text-[9px] sm:text-[10px] font-black ${
                              p === 'present' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                            }`}>
                              {p === 'present' ? 'P' : 'A'}
                            </div>
                          </td>
                        ))}
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                          <span className={`text-[10px] font-black px-2 py-1 rounded-md ${
                            presentCount >= 3 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {presentCount}/5
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {history.length === 0 && <p className="p-12 text-center text-gray-300 font-black uppercase tracking-widest text-xs">No records synchronised</p>}
            </div>
            {history.length > 5 && (
              <div className="bg-gray-50/50 p-4 border-t border-gray-100 flex justify-center">
                <Link to="/student/history" className="btn-primary py-2 px-6 shadow-md flex items-center gap-2 text-xs uppercase tracking-widest font-black">
                  View All History <ChevronRight size={14} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 sm:p-6 flex items-start gap-3 sm:gap-4 shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
          <Info size={18} />
        </div>
        <div>
          <p className="text-xs font-black text-blue-900 uppercase tracking-widest mb-1">Academic Policy Disclaimer</p>
            <p className="text-xs text-blue-700 font-medium leading-relaxed">
              Attendance is calculated based on 5 periods per day. A day is considered present if you attend at least 3 periods. Your current percentage is calculated based on the total classes conducted so far. Maintain a minimum of 75% overall attendance to be eligible for end-semester examinations.
            </p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
