import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import SectionTitle from '../components/SectionTitle';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const previewAnnouncements = [
    { title: "Final Exam Schedule", date: "May 02, 2026" },
    { title: "Course Feedback Open", date: "April 30, 2026" },
    { title: "Holiday Notice", date: "April 28, 2026" }
  ];

  return (
    <div className="space-y-10">
      <div className="bg-white border border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Welcome, Student Name</h1>
        <p className="text-secondary font-medium italic">BCA • 2nd Year | Student ID: STU2026001</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Quick Overview */}
        <div className="bg-white border border-gray-200 p-8">
          <SectionTitle title="Latest Notifications" />
          <div className="space-y-4">
            {previewAnnouncements.map((ann, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 border-l-4 border-l-primary group cursor-pointer hover:bg-gray-100 transition-all">
                <div>
                  <h4 className="text-sm font-bold text-primary group-hover:text-accent transition-colors">{ann.title}</h4>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{ann.date}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-8 text-xs font-bold text-primary uppercase tracking-widest hover:underline">View All Notifications</button>
        </div>

        {/* Account Info */}
        <div className="bg-primary text-white p-8 flex flex-col justify-between min-h-[300px]">
          <div>
            <h2 className="text-2xl font-bold mb-6 uppercase tracking-tight">Portal Information</h2>
            <p className="text-gray-300 text-sm leading-relaxed mb-8">
              Use the student portal to access your course materials, view your examination results, and manage your academic profile.
            </p>
          </div>
          <div className="space-y-4">
            <div className="bg-white/10 p-4 rounded text-sm font-bold">
              Account Status: Active
            </div>
            <div className="bg-white/10 p-4 rounded text-sm font-bold">
              Registration Year: 2026
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
