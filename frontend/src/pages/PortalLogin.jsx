import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, Lock, Mail, ChevronLeft, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';

const PortalLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await loginUser(email, password);
    setLoading(false);
    
    if (result.success) {
      if (result.role === 'admin') {
        navigate('/admin');
      } else {
        setError('This portal is for Administration only.');
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#1B3A5C] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-white rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-white rounded-full blur-[120px]"></div>
      </div>

      <div className="w-[92%] max-w-[400px] relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 text-[10px] font-black uppercase tracking-widest transition-colors group">
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Website
        </Link>

        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-white/10">
          <div className="p-6 sm:p-10">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-secondary/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-secondary border border-secondary/10">
                <ShieldCheck size={32} strokeWidth={1.5} />
              </div>
              <h1 className="font-heading text-xl sm:text-2xl font-black text-secondary tracking-tight">Institutional Portal</h1>
              <p className="text-gray-400 text-[9px] mt-2 uppercase tracking-[0.2em] font-black">Secure Admin Access Only</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 text-[10px] font-bold flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full shrink-0"></div>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                  Institutional Email
                </label>
                <div className="relative group">
                  <Mail size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-secondary transition-colors" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-secondary/5 focus:border-secondary focus:bg-white outline-none transition-all text-sm font-bold text-gray-800 placeholder:text-gray-300"
                    placeholder="admin@college.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                  Access Key
                </label>
                <div className="relative group">
                  <Lock size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-secondary transition-colors" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-secondary/5 focus:border-secondary focus:bg-white outline-none transition-all text-sm font-bold text-gray-800 placeholder:text-gray-300"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className={`w-full py-4 bg-[#1B3A5C] hover:bg-[#254E7A] text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-secondary/20 mt-2 flex items-center justify-center gap-3 active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Authenticating...' : (
                  <>
                    <LayoutDashboard size={16} />
                    Enter Command Center
                  </>
                )}
              </button>
            </form>
          </div>
          
          <div className="bg-gray-50/80 p-5 border-t border-gray-100 text-center">
            <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
              This system is monitored. Unauthorized access attempts are logged.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalLogin;
