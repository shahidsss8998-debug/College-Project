import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, GraduationCap, Lock, Mail } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, loginUser, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'student') navigate('/student');
      else if (user.role === 'admin') navigate('/admin');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await loginUser(email, password);
    setLoading(false);
    
    if (result.success) {
      if (result.role === 'student') {
        navigate('/student');
      } else {
        setError('Staff/Admin accounts cannot log in here. Please use the secure portal.');
        logoutUser();
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex">
      {/* Left Side - Campus Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
          alt="Campus" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 overlay-gradient flex items-center justify-center">
          <div className="text-center text-white px-12">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/20">
              <GraduationCap size={32} className="text-accent" />
            </div>
            <h2 className="font-heading text-3xl font-bold mb-3">Merit Haji Ismail Sahib</h2>
            <p className="text-accent font-heading text-lg italic mb-2">Arts & Science College</p>
            <p className="text-white/60 text-sm font-heading italic">"Enter To Learn, Leave To Serve"</p>
            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="text-white/40 text-xs">Affiliated to Thiruvalluvar University | Pernambut, Tamil Nadu</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-bg-page px-4 py-12">
        <div className="w-[92%] max-w-[400px]">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
              <GraduationCap size={24} className="text-white" />
            </div>
            <h2 className="font-heading text-lg font-bold text-secondary">MHIS College</h2>
            <p className="text-[10px] text-gray-400">Student Portal Access</p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="text-center mb-8">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5 text-primary">
                  <User size={28} />
                </div>
                <h3 className="font-heading text-xl font-bold text-secondary tracking-tight">Student Portal</h3>
                <p className="text-gray-400 text-[10px] mt-2 uppercase tracking-widest font-bold">
                  Enter your credentials
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 text-[10px] font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full shrink-0 animate-pulse"></div>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2.5">
                    Student Email
                  </label>
                  <div className="relative group">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-white outline-none transition-all text-sm font-bold text-gray-800 placeholder:text-gray-300"
                      placeholder="student@college.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2.5">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-white outline-none transition-all text-sm font-bold text-gray-800 placeholder:text-gray-300"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-primary/20 mt-2 active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Authenticating...' : 'Sign In to Portal'}
                </button>
              </form>

              <p className="mt-8 text-center text-[10px] text-gray-400 leading-relaxed">
                Authorized access only. By logging in, you agree to the 
                institutional terms of service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
