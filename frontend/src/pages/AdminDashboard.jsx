import { useContext, useState, useEffect } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Users, Clock, AlertCircle, Loader2, Database, ShieldCheck, TrendingUp } from 'lucide-react';



const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ activeStudents: '...', avgAttendance: '...', actionRequired: '...' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await API.get('/auth/dashboard-stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const quickStats = [
    { name: 'Active Students', value: stats.activeStudents, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    { name: 'Average Attendance', value: stats.avgAttendance, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { name: 'Action Required', value: stats.actionRequired, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-secondary">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome back, {user?.name}. Here is the live system status.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
          <ShieldCheck size={14} />
          <span className="text-xs font-semibold">System Active</span>
        </div>
      </header>

      {loading ? (
        <div className="p-20 text-center">
          <Loader2 size={36} className="animate-spin mx-auto text-primary mb-4" />
          <p className="text-sm text-gray-400 font-medium">Loading metrics...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {quickStats.map((stat, i) => (
            <div key={i} className="card p-5 sm:p-6 flex items-center gap-4 sm:gap-5 hover:shadow-md transition-all">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                <stat.icon size={20} sm:size={24} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-widest truncate">{stat.name}</p>
                <h3 className="text-xl sm:text-2xl font-black text-secondary truncate">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="card p-5 sm:p-8">
          <h4 className="text-sm font-bold text-secondary uppercase tracking-wider mb-6 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
            Real-Time Intelligence
          </h4>
          <div className="space-y-4">
            <div className="p-4 bg-cream rounded-xl border border-gray-100">
              <p className="text-sm text-gray-700 leading-relaxed">
                The institution currently manages <span className="text-primary font-semibold">{stats.activeStudents} active profiles</span> with an average attendance rate of <span className="text-emerald-600 font-semibold">{stats.avgAttendance}</span>. 
                {parseInt(stats.actionRequired) > 0 ? (
                  <span className="text-red-500 font-semibold"> There are {stats.actionRequired} students with attendance below threshold.</span>
                ) : (
                  <span className="text-emerald-600 font-semibold"> All students are above the attendance threshold.</span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-4 py-3 opacity-60">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Database size={14} /></div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">Database sync active</p>
                <p className="text-[10px] text-gray-400 font-medium">Updated moments ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6 md:p-8 bg-secondary text-white border-none relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12"><Database size={100} /></div>
          <h4 className="text-xs font-bold text-accent uppercase tracking-widest mb-6">System Health</h4>
          <p className="text-sm text-gray-300 leading-relaxed mb-8">
            The academic database is performing at peak efficiency. All student records and attendance logs are backed up in real-time.
          </p>
          <div className="space-y-4">
            <div className="flex justify-between items-end mb-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Storage & Compute</p>
              <p className="text-sm font-bold text-white">98.2%</p>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-[98%] bg-accent rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
