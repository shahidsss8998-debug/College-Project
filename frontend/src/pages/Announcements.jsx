import { useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Megaphone, Plus, Trash2, Filter, Loader2, Calendar, Send, Edit2, X } from 'lucide-react';



const Announcements = () => {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin';
  
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAnn, setNewAnn] = useState({ title: '', content: '', department: 'All' });
  const [editingId, setEditingId] = useState(null);
  const [deptFilter, setDeptFilter] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const { data } = await API.get('/portal/announcements');
      setAnnouncements(data);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (ann) => {
    setNewAnn({ title: ann.title, content: ann.content, department: ann.department });
    setEditingId(ann._id);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/portal/announcements/${editingId}`, newAnn);
        setMessage('Announcement updated successfully!');
      } else {
        await API.post('/portal/announcements', newAnn);
        setMessage('Announcement posted successfully!');
      }

      setNewAnn({ title: '', content: '', department: 'All' });
      setEditingId(null);
      setShowAddForm(false);
      fetchAnnouncements();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Announcement Error:', error);
      const errorMsg = error.response?.data?.message || 'Error processing announcement.';
      setMessage(`Error: ${errorMsg}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this announcement?')) {
      try {
        await API.delete(`/portal/announcements/${id}`);
        fetchAnnouncements();
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Institutional Bulletin</h1>
          <p className="text-sm text-gray-500 font-medium">Stay updated with the latest news and notifications.</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => {
              setShowAddForm(!showAddForm);
              if (showAddForm) {
                setEditingId(null);
                setNewAnn({ title: '', content: '', department: 'All' });
              }
            }}
            className="btn-primary flex items-center gap-2 px-6 shadow-xl"
          >
            {showAddForm ? <X size={18} /> : <Plus size={18} />}
            {showAddForm ? 'Close' : 'Post Announcement'}
          </button>
        )}
      </header>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <select 
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white border border-gray-100 rounded-xl outline-none focus:ring-2 ring-primary/10 transition-all font-bold text-[10px] uppercase tracking-widest appearance-none shadow-sm min-w-[150px]"
          >
            <option value="">All Departments</option>
            <option value="BCA">BCA</option>
            <option value="B.Sc CS">B.Sc CS</option>
            <option value="B.Com">B.Com</option>
            <option value="BBA">BBA</option>
          </select>
        </div>
      </div>

      {message && (
        <div className="p-4 bg-green-50 text-green-700 border border-green-100 rounded-xl text-xs font-bold animate-in fade-in slide-in-from-top-2">
          {message}
        </div>
      )}

      {showAddForm && (
        <div className="card p-5 sm:p-8 animate-in zoom-in-95 duration-300 shadow-2xl border-primary/20">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Edit2 size={16} className="text-primary" />
            {editingId ? 'Edit Announcement' : 'Create New Announcement'}
          </h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Title</label>
              <input 
                type="text" 
                required
                value={newAnn.title}
                onChange={(e) => setNewAnn({...newAnn, title: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 ring-primary/10 transition-all font-bold text-sm"
                placeholder="Announcement Title"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Department</label>
              <select 
                value={newAnn.department}
                onChange={(e) => setNewAnn({...newAnn, department: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 ring-primary/10 transition-all font-bold text-sm"
              >
                <option value="All">All Departments</option>
                <option value="BCA">BCA</option>
                <option value="B.Sc CS">B.Sc CS</option>
                <option value="B.Com">B.Com</option>
                <option value="BBA">BBA</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Content</label>
              <textarea 
                required
                rows="4"
                value={newAnn.content}
                onChange={(e) => setNewAnn({...newAnn, content: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 ring-primary/10 transition-all font-bold text-sm"
                placeholder="Write the details here..."
              />
            </div>
            <button type="submit" className="btn-primary w-full h-12 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 uppercase text-[10px] tracking-[0.2em] font-black">
              <Send size={18} />
              {editingId ? 'Update Notification' : 'Publish Notification'}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center">
          <Loader2 size={40} className="animate-spin mx-auto text-primary mb-4" />
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Fetching Bulletin...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {announcements
            .filter(ann => !deptFilter || ann.department === deptFilter || ann.department === 'All')
            .length === 0 ? (
            <div className="p-20 text-center text-gray-400 font-black uppercase tracking-widest text-xs border-2 border-dashed border-gray-100 rounded-3xl">
              No matching announcements found.
            </div>
          ) : announcements
              .filter(ann => !deptFilter || ann.department === deptFilter || ann.department === 'All')
              .map((ann) => (
            <div key={ann._id} className="card p-5 sm:p-8 group hover:border-primary/30 transition-all relative">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0 mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-primary flex items-center justify-center shadow-inner">
                    <Megaphone size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900 tracking-tight">{ann.title}</h3>
                    <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(ann.createdAt).toLocaleDateString()}
                      </div>
                      <div className="px-2 py-0.5 bg-gray-100 rounded text-gray-500">
                        {ann.department}
                      </div>
                    </div>
                  </div>
                </div>
                {isAdmin && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(ann)}
                      className="p-2 text-gray-300 hover:text-primary transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(ann._id)}
                      className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                {ann.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Announcements;
