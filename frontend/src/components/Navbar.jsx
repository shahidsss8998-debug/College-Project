import { useContext, useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User as UserIcon, Phone, Mail, MapPin, Menu, X, ChevronRight } from 'lucide-react';

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logoutUser } = useContext(AuthContext);
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef(null);

  const isPortal = location.pathname.startsWith('/student') || location.pathname.startsWith('/admin') || location.pathname === '/profile';

  // Close menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };
    if (mobileOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Courses', path: '/courses' },
  ];

  return (
    <>
      {/* Top Bar - hidden on mobile */}
      {!isPortal && (
        <div className="bg-secondary text-white text-[10px] sm:text-xs hidden sm:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-9">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5 text-gray-300">
                <Phone size={10} />
                +91 04172 265 266
              </span>
              <span className="flex items-center gap-1.5 text-gray-300">
                <Mail size={10} />
                info@mhiscollege.edu.in
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-300">
              <MapPin size={10} />
              Pernambut, Tamil Nadu
            </div>
          </div>
        </div>
      )}

      {/* Main Navbar */}
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm" ref={menuRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center ${isPortal ? 'h-14 sm:h-16' : 'h-16 sm:h-[72px]'}`}>
            {/* Logo Section */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0 min-w-0">
              {/* Portal Sidebar Toggle (Mobile only) */}
              {isPortal && (
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="md:hidden p-1.5 text-gray-400 hover:text-primary rounded-lg transition-colors mr-1"
                  aria-label="Toggle sidebar"
                >
                  {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              )}
              <Link to="/" className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                <img 
                  src="https://meritscollege.in/wp-content/uploads/2021/03/jpg.jpg" 
                  alt="College Crest" 
                  className={`${isPortal ? 'h-6 sm:h-8' : 'h-6 sm:h-12'} w-auto object-contain shrink-0`}
                />
                <div className="flex flex-col min-w-0">
                  <h1 className="font-heading text-[10px] min-[400px]:text-xs sm:text-lg font-black text-secondary leading-tight tracking-tight truncate">
                    {isPortal ? 'MHIS College' : (
                      <>
                        <span className="min-[450px]:hidden">MHIS College</span>
                        <span className="hidden min-[450px]:inline">Merit Haji Ismail Sahib</span>
                      </>
                    )}
                  </h1>
                  {!isPortal && (
                    <p className="hidden min-[500px]:block text-[8px] sm:text-[10px] text-gray-400 font-bold tracking-[0.2em] uppercase">
                      Arts & Science College
                    </p>
                  )}
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            {!isPortal && (
              <div className="hidden lg:flex items-center justify-center gap-1 flex-1 px-8">
                {navLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-2 text-sm font-bold rounded-xl transition-all duration-300 ${location.pathname === link.path
                      ? 'text-primary bg-primary/5 shadow-sm shadow-primary/5'
                      : 'text-gray-500 hover:text-primary hover:bg-gray-50'
                      }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Actions Section */}
            <div className="flex items-center gap-1 sm:gap-4 shrink-0">
              {user ? (
                <div className="flex items-center gap-1 sm:gap-4">
                  <Link to="/profile" className="flex items-center gap-1.5 px-1.5 py-1 rounded-xl hover:bg-gray-50 transition-all">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                      <UserIcon size={14} />
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-[10px] font-black text-gray-900 leading-none">{user.name}</p>
                    </div>
                  </Link>
                  <button
                    onClick={logoutUser}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-xl transition-all"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="btn-primary text-[8px] min-[400px]:text-[10px] sm:text-xs px-2 min-[400px]:px-4 sm:px-8 py-2 sm:py-3 flex items-center gap-1 sm:gap-2 whitespace-nowrap shadow-lg shadow-primary/10"
                >
                  <span className="font-black uppercase tracking-widest">Student Login</span>
                  <ChevronRight size={12} strokeWidth={3} className="hidden sm:block" />
                </Link>
              )}

              {/* Mobile Menu Toggle (Public Only) */}
              {!isPortal && (
                <button
                  className="lg:hidden p-1.5 text-gray-600 hover:text-primary rounded-lg transition-colors"
                  onClick={() => setMobileOpen(!mobileOpen)}
                >
                  {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen && !isPortal ? 'max-h-80 border-t border-gray-100' : 'max-h-0'
          }`}>
          <div className="px-4 py-3 space-y-1 bg-white">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${location.pathname === link.path
                  ? 'text-primary bg-primary/5'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="px-6 py-3 border-t border-gray-100 text-[11px] text-gray-400 space-y-2 bg-gray-50/50">
            <p className="flex items-center gap-2"><Phone size={11} /> +91 04172 265 266</p>
            <p className="flex items-center gap-2"><Mail size={11} /> info@mhiscollege.edu.in</p>
            <p className="flex items-center gap-2"><MapPin size={11} /> Pernambut, Tamil Nadu</p>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
