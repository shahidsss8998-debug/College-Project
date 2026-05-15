import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, Clock, Megaphone, Calendar, GraduationCap, Menu, X } from 'lucide-react';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const menuItems = user?.role === 'admin'
    ? [
      { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
      { name: 'Mark Attendance', path: '/admin/attendance', icon: Clock },
      { name: 'Attendance Records', path: '/admin/attendance-records', icon: Calendar },
      { name: 'Manage Students', path: '/admin/students', icon: Users },
      { name: 'Announcements', path: '/admin/announcements', icon: Megaphone },
      { name: 'Campus Events', path: '/admin/events', icon: Calendar },
      { name: 'Resources', path: '/admin/resources', icon: BookOpen },
    ]
    : [
      { name: 'Overview', path: '/student', icon: LayoutDashboard },
      { name: 'My History', path: '/student/history', icon: Clock },
      { name: 'Announcements', path: '/student/announcements', icon: Megaphone },
      { name: 'Campus Events', path: '/student/events', icon: Calendar },
      { name: 'Resources', path: '/student/resources', icon: BookOpen },
      { name: 'My Profile', path: '/profile', icon: Users },
    ];

  const SidebarContent = () => (
    <>
      {/* Sidebar Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <GraduationCap size={18} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-secondary leading-none">
              {user?.role === 'admin' ? 'Admin Portal' : 'Student Portal'}
            </p>
            <p className="text-[10px] text-accent font-semibold mt-0.5 uppercase tracking-wide">
              MHIS College
            </p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-4 px-3 flex-1">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-3">
          Navigation
        </p>
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                    }`}
                >
                  <item.icon size={17} className={isActive ? 'text-white' : 'text-gray-400'} />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="bg-cream rounded-lg p-3 text-center">
          <p className="text-[10px] text-gray-500 font-medium">Academic Year</p>
          <p className="text-sm font-bold text-primary">2025 – 2026</p>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar (slide-in drawer) */}
      <aside className={`md:hidden fixed left-0 top-14 sm:top-16 w-72 bg-white border-r border-gray-200 h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)] z-40 flex flex-col overflow-y-auto transition-transform duration-300 ease-out shadow-2xl ${mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-64px)] fixed left-0 top-16 hidden md:flex flex-col overflow-y-auto">
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;
