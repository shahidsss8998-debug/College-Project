import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import About from './pages/About';
import Courses from './pages/Courses';
import Announcements from './pages/Announcements';
import Events from './pages/Events';
import Resources from './pages/Resources';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AttendancePage from './pages/AttendancePage';
import StudentHistory from './pages/StudentHistory';
import StudentManagement from './pages/StudentManagement';
import AdminStudentProfile from './pages/AdminStudentProfile';
import StudentRegistration from './pages/StudentRegistration';
import Profile from './pages/Profile';
import AttendanceRecords from './pages/AttendanceRecords';
import AttendanceRecordDetail from './pages/AttendanceRecordDetail';
import PortalLogin from './pages/PortalLogin';

import ProtectedRoute from './components/ProtectedRoute';

const AppContent = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Paths that should show the Sidebar (Protected portal paths)
  const isPortal = (location.pathname.startsWith('/student') || location.pathname.startsWith('/admin') || location.pathname === '/profile') && user;

  // Close sidebar on navigation
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-bg-page overflow-x-hidden relative">
      {/* Navbar is visible everywhere */}
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex w-full">
        {isPortal && <Sidebar mobileOpen={sidebarOpen} setMobileOpen={setSidebarOpen} />}
        <main className={`flex-1 min-w-0 w-full overflow-x-hidden ${isPortal ? 'md:ml-64 p-4 md:p-8' : ''}`}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/login" element={<Login />} />
            <Route path="/mhis-portal" element={<PortalLogin />} />

            {/* Protected Student Routes */}
            <Route path="/student" element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/student/history" element={
              <ProtectedRoute role="student">
                <StudentHistory />
              </ProtectedRoute>
            } />
            <Route path="/student/announcements" element={
              <ProtectedRoute role="student">
                <Announcements />
              </ProtectedRoute>
            } />
            <Route path="/student/events" element={
              <ProtectedRoute role="student">
                <Events />
              </ProtectedRoute>
            } />
            <Route path="/student/resources" element={
              <ProtectedRoute role="student">
                <Resources />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/attendance" element={
              <ProtectedRoute role="admin">
                <AttendancePage />
              </ProtectedRoute>
            } />
            <Route path="/admin/attendance-records" element={
              <ProtectedRoute role="admin">
                <AttendanceRecords />
              </ProtectedRoute>
            } />
            <Route path="/admin/attendance-records/:id" element={
              <ProtectedRoute role="admin">
                <AttendanceRecordDetail />
              </ProtectedRoute>
            } />
            <Route path="/admin/students" element={
              <ProtectedRoute role="admin">
                <StudentManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/students/:id" element={
              <ProtectedRoute role="admin">
                <AdminStudentProfile />
              </ProtectedRoute>
            } />
            <Route path="/admin/students/add" element={
              <ProtectedRoute role="admin">
                <StudentRegistration />
              </ProtectedRoute>
            } />
            <Route path="/admin/students/edit/:id" element={
              <ProtectedRoute role="admin">
                <StudentRegistration />
              </ProtectedRoute>
            } />
            <Route path="/admin/announcements" element={
              <ProtectedRoute role="admin">
                <Announcements />
              </ProtectedRoute>
            } />
            <Route path="/admin/events" element={
              <ProtectedRoute role="admin">
                <Events />
              </ProtectedRoute>
            } />
            <Route path="/admin/resources" element={
              <ProtectedRoute role="admin">
                <Resources />
              </ProtectedRoute>
            } />

            {/* Default Catch-all */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
