import { useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, Plus, Trash2, Filter, Loader2, Download, ExternalLink, GraduationCap, X, FileUp, FileText, ImageIcon, Edit2 } from 'lucide-react';



const Resources = () => {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin';
  
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRes, setNewRes] = useState({ title: '', subject: '', department: 'BCA', semester: 1, fileUrl: '' });
  const [editingId, setEditingId] = useState(null);
  const [fileName, setFileName] = useState('');
  const [filter, setFilter] = useState({ department: '', semester: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchResources();
  }, [filter]);

  const fetchResources = async () => {
    try {
      const { data } = await API.get('/portal/resources', {
        params: filter
      });
      setResources(data);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (res) => {
    setNewRes({ 
      title: res.title, 
      subject: res.subject, 
      department: res.department, 
      semester: res.semester, 
      fileUrl: res.fileUrl 
    });
    setEditingId(res._id);
    setFileName('Existing File (Click to Change)');
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setMessage('Error: File size too large (Max 5MB)');
        return;
      }
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewRes({ ...newRes, fileUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newRes.fileUrl) {
      setMessage('Error: Please upload a file');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Error: Authentication token missing. Please log in again.');
      return;
    }

    try {
      if (editingId) {
        await API.put(`/portal/resources/${editingId}`, newRes);
        setMessage('Resource updated successfully!');
      } else {
        await API.post('/portal/resources', newRes);
        setMessage('Resource uploaded successfully!');
      }

      setNewRes({ title: '', subject: '', department: 'BCA', semester: 1, fileUrl: '' });
      setFileName('');
      setEditingId(null);
      setShowAddForm(false);
      fetchResources();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Error uploading resource.';
      setMessage(`Error: ${errorMsg}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Remove this resource?')) {
      try {
        await API.delete(`/portal/resources/${id}`);
        fetchResources();
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Resource Hub</h1>
          <p className="text-sm text-gray-500 font-medium">Access official syllabus, notes, and previous year papers.</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => {
              setShowAddForm(!showAddForm);
              if (showAddForm) {
                setEditingId(null);
                setNewRes({ title: '', subject: '', department: 'BCA', semester: 1, fileUrl: '' });
                setFileName('');
              }
            }}
            className="btn-primary flex items-center gap-2 px-6 shadow-xl"
          >
            {showAddForm ? <X size={18} /> : <FileUp size={18} />}
            {showAddForm ? 'Close' : 'Upload New Resource'}
          </button>
        )}
      </header>

      {/* Filters Section */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <select 
            value={filter.department}
            onChange={(e) => setFilter({...filter, department: e.target.value})}
            className="w-full sm:w-auto pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 ring-primary/10 transition-all font-bold text-[10px] uppercase tracking-widest shadow-sm appearance-none sm:min-w-[200px]"
          >
            <option value="">All Departments</option>
            <option value="BCA">BCA</option>
            <option value="B.Sc CS">B.Sc CS</option>
            <option value="B.Com">B.Com</option>
            <option value="BBA">BBA</option>
          </select>
        </div>
        <div className="relative">
          <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <select 
            value={filter.semester}
            onChange={(e) => setFilter({...filter, semester: e.target.value})}
            className="w-full sm:w-auto pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 ring-primary/10 transition-all font-bold text-[10px] uppercase tracking-widest shadow-sm appearance-none sm:min-w-[200px]"
          >
            <option value="">All Semesters</option>
            {[1,2,3,4,5,6].map(s => (
              <option key={s} value={s}>Semester {s}</option>
            ))}
          </select>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-xs font-bold border animate-in fade-in slide-in-from-top-2 ${
          message.includes('Error') ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'
        }`}>
          {message}
        </div>
      )}

      {showAddForm && (
        <div className="card p-5 sm:p-8 animate-in zoom-in-95 duration-300 shadow-2xl border-primary/20">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Edit2 size={16} className="text-primary" />
            {editingId ? 'Edit Resource' : 'Upload New Resource'}
          </h2>
          <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Document Title</label>
              <input 
                type="text" required
                value={newRes.title}
                onChange={(e) => setNewRes({...newRes, title: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 ring-primary/10 transition-all font-bold text-sm"
                placeholder="e.g. Operating Systems Notes"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Subject</label>
              <input 
                type="text" required
                value={newRes.subject}
                onChange={(e) => setNewRes({...newRes, subject: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 ring-primary/10 transition-all font-bold text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Department</label>
              <select 
                value={newRes.department}
                onChange={(e) => setNewRes({...newRes, department: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 ring-primary/10 transition-all font-bold text-sm"
              >
                <option value="BCA">BCA</option>
                <option value="B.Sc CS">B.Sc CS</option>
                <option value="B.Com">B.Com</option>
                <option value="BBA">BBA</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Semester</label>
              <select 
                value={newRes.semester}
                onChange={(e) => setNewRes({...newRes, semester: parseInt(e.target.value)})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 ring-primary/10 transition-all font-bold text-sm"
              >
                {[1,2,3,4,5,6].map(s => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>
            
            <div className="sm:col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Upload File (PDF or Image)</label>
              <div className="relative group">
                <input 
                  type="file" 
                  accept=".pdf,image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="resource-file"
                />
                <label 
                  htmlFor="resource-file"
                  className="flex flex-col items-center justify-center w-full h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-primary transition-all group-hover:bg-primary/5"
                >
                  {fileName ? (
                    <div className="flex items-center gap-3">
                      <FileText className="text-primary" size={24} />
                      <span className="text-sm font-bold text-gray-900">{fileName}</span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <FileUp size={32} className="mx-auto text-gray-300 mb-2 group-hover:text-primary" />
                      <p className="text-xs font-bold text-gray-400">Click to upload PDF or Image (Max 5MB)</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div className="sm:col-span-2 flex justify-end gap-3 mt-4">
              <button type="submit" className="btn-primary px-8 sm:px-10 shadow-lg shadow-primary/20 uppercase text-[10px] tracking-[0.2em] font-black h-12 w-full sm:w-auto">
                {editingId ? 'Update Resource' : 'Add to Repository'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center">
          <Loader2 size={40} className="animate-spin mx-auto text-primary mb-4" />
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Indexing Assets...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {resources.length === 0 ? (
            <div className="sm:col-span-2 lg:col-span-3 p-12 sm:p-20 text-center text-gray-300 font-black uppercase tracking-widest text-[10px]">
              No resources found for selected criteria.
            </div>
          ) : resources.map((res) => (
            <div key={res._id} className="card p-6 group hover:border-primary/40 transition-all shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shadow-inner">
                  {res.fileUrl.startsWith('data:image/') ? <ImageIcon size={24} /> : <FileText size={24} />}
                </div>
                <div className="flex flex-col items-end">
                  <span className="px-3 py-1 bg-gray-100 text-[8px] font-black text-gray-500 rounded-full uppercase tracking-widest mb-2">
                    {res.department}
                  </span>
                  {isAdmin && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(res)}
                        className="text-gray-300 hover:text-primary transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(res._id)}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-black text-gray-900 tracking-tight leading-tight">{res.title}</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                    {res.subject} • Sem {res.semester}
                  </p>
                </div>
                <a 
                  href={res.fileUrl} 
                  download={res.title}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-gray-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-gray-200"
                >
                  <Download size={14} />
                  Download File
                  <ExternalLink size={10} className="opacity-50" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Resources;
