import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Calendar, Check, X, Loader2 } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const StudentHistory = () => {
  const { user } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      if (user?.id) {
        try {
          const response = await axios.get(`${API_URL}/attendance/history/${user.id}`);
          // Sort by date descending
          const sortedData = response.data.sort((a, b) => b.date.localeCompare(a.date));
          setHistory(sortedData);
        } catch (error) {
          console.error('Error fetching history:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchHistory();
  }, [user]);

  // Group records by month-year
  const groupedHistory = history.reduce((groups, record) => {
    const dateObj = new Date(record.date);
    const monthYear = dateObj.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    if (!groups[monthYear]) groups[monthYear] = [];
    groups[monthYear].push(record);
    return groups;
  }, {});

  const availableMonths = Object.keys(groupedHistory);

  // Auto-select the most recent month if not set
  useEffect(() => {
    if (availableMonths.length > 0 && !selectedMonth) {
      setSelectedMonth(availableMonths[0]);
    }
  }, [availableMonths, selectedMonth]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
      <Loader2 size={32} className="animate-spin text-primary" />
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading History...</p>
    </div>
  );

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  const formatDateShort = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short'
    });
  };

  const getDayOrderColor = (dayOrder) => {
    const colors = {
      'D1': 'bg-blue-100 text-blue-700 border-blue-200',
      'D2': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'D3': 'bg-purple-100 text-purple-700 border-purple-200',
      'D4': 'bg-orange-100 text-orange-700 border-orange-200',
      'D5': 'bg-pink-100 text-pink-700 border-pink-200',
      'D6': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    };
    return colors[dayOrder] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const monthRecords = selectedMonth ? groupedHistory[selectedMonth] : [];

  return (
    <div className="max-w-6xl mx-auto space-y-5 sm:space-y-8">
      <header>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Attendance History</h1>
        <p className="text-xs sm:text-sm text-gray-500">View your daily period-wise attendance records.</p>
      </header>

      {history.length === 0 ? (
        <div className="card p-12 text-center text-gray-400">
          <Calendar size={48} className="mx-auto mb-4 opacity-20" />
          <p className="font-bold uppercase tracking-widest text-xs">No records found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* ─── MONTH SELECTOR TABS ─── */}
          <div className="flex flex-wrap pb-2 gap-2 sm:gap-3">
            {availableMonths.map(month => (
              <button
                key={month}
                onClick={() => setSelectedMonth(month)}
                className={`px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex-grow sm:flex-grow-0 text-center ${selectedMonth === month
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 shadow-sm'
                  }`}
              >
                {month}
              </button>
            ))}
          </div>

          <div key={selectedMonth} className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
            {/* ─── DESKTOP TABLE (hidden on mobile/tablet) ─── */}
            <div className="hidden lg:block card overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="table-header">Date</th>
                      <th className="table-header text-center">Day Order</th>
                      {[1, 2, 3, 4, 5].map(p => (
                        <th key={p} className="table-header text-center">Period {p}</th>
                      ))}
                      <th className="table-header text-center">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {monthRecords.map((record, i) => {
                      const dayTotal = record.periods.filter(p => p === 'present').length;
                      return (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                          <td className="table-cell font-bold text-gray-900">
                            {formatDate(record.date)}
                          </td>
                          <td className="table-cell text-center">
                            <span className={`px-2 py-1 rounded border text-[10px] font-black tracking-wider uppercase ${getDayOrderColor(record.dayOrder)}`}>
                              {record.dayOrder || '-'}
                            </span>
                          </td>
                          {record.periods.map((p, idx) => (
                            <td key={idx} className="table-cell text-center">
                              <div className={`mx-auto w-6 h-6 rounded-full flex items-center justify-center ${p === 'present' ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'
                                }`}>
                                {p === 'present' ? <Check size={14} strokeWidth={3} /> : <X size={14} strokeWidth={3} />}
                              </div>
                            </td>
                          ))}
                          <td className="table-cell text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-black ${dayTotal >= 3 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                              {dayTotal}/5
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ─── MOBILE/TABLET CARD VIEW (shown below lg) ─── */}
            <div className="lg:hidden space-y-3">
              {monthRecords.map((record, i) => {
                const dayTotal = record.periods.filter(p => p === 'present').length;
                return (
                  <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                    {/* Top row: Date + Total */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-primary" />
                        <span className="text-xs font-bold text-gray-800">{formatDateShort(record.date)}</span>
                        {record.dayOrder && (
                          <span className={`px-1.5 py-0.5 rounded border text-[9px] font-black tracking-wider uppercase ml-1 ${getDayOrderColor(record.dayOrder)}`}>
                            {record.dayOrder}
                          </span>
                        )}
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${dayTotal >= 3 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {dayTotal}/5
                      </span>
                    </div>
                    {/* Period grid */}
                    <div className="grid grid-cols-5 gap-2">
                      {record.periods.map((p, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-1">
                          <span className="text-[9px] font-bold text-gray-400 uppercase">P{idx + 1}</span>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${p === 'present'
                              ? 'bg-green-50 text-green-600 border border-green-200'
                              : 'bg-red-50 text-red-600 border border-red-200'
                            }`}>
                            {p === 'present' ? <Check size={14} strokeWidth={3} /> : <X size={14} strokeWidth={3} />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Record count */}
          <div className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest py-2">
            Showing {monthRecords?.length || 0} Records for {selectedMonth}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentHistory;
