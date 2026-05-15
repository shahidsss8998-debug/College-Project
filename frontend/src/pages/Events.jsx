import { useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Calendar, Plus, Trash2, MapPin, Loader2, Users, CheckCircle, Clock, Edit2, X } from 'lucide-react';



const Events = () => {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin';
  
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '', venue: '' });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await API.get('/portal/events');
      setEvents(data);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (ev) => {
    // Format date for datetime-local input (YYYY-MM-DDTHH:mm)
    const formattedDate = new Date(ev.date).toISOString().slice(0, 16);
    setNewEvent({ 
      title: ev.title, 
      description: ev.description, 
      date: formattedDate, 
      venue: ev.venue 
    });
    setEditingId(ev._id);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/portal/events/${editingId}`, newEvent);
        setMessage('Event updated successfully!');
      } else {
        await API.post('/portal/events', newEvent);
        setMessage('Event scheduled successfully!');
      }

      setNewEvent({ title: '', description: '', date: '', venue: '' });
      setEditingId(null);
      setShowAddForm(false);
      fetchEvents();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Event Error:', error);
      const errorMsg = error.response?.data?.message || 'Error processing events.';
      setMessage(`Error: ${errorMsg}`);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      await API.post(`/portal/events/${eventId}/register`, {});
      fetchEvents();
      setMessage('You have registered for the event!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Cancel this event?')) {
      try {
        await API.delete(`/portal/events/${id}`);
        fetchEvents();
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Campus Events</h1>
          <p className="text-sm text-gray-500 font-medium">Join us for upcoming workshops, seminars, and activities.</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => {
              setShowAddForm(!showAddForm);
              if (showAddForm) {
                setEditingId(null);
                setNewEvent({ title: '', description: '', date: '', venue: '' });
              }
            }}
            className="btn-primary flex items-center gap-2 px-6 shadow-xl"
          >
            {showAddForm ? <X size={18} /> : <Plus size={18} />}
            {showAddForm ? 'Close' : 'Schedule Event'}
          </button>
        )}
      </header>

      {message && (
        <div className="p-4 bg-blue-50 text-blue-700 border border-blue-100 rounded-xl text-xs font-bold animate-in fade-in slide-in-from-top-2">
          {message}
        </div>
      )}

      {showAddForm && (
        <div className="card p-5 sm:p-8 animate-in zoom-in-95 duration-300 shadow-2xl border-primary/20">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Edit2 size={16} className="text-primary" />
            {editingId ? 'Edit Campus Event' : 'Schedule New Event'}
          </h2>
          <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Event Title</label>
              <input 
                type="text" required
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 ring-primary/10 transition-all font-bold text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</label>
              <input 
                type="datetime-local" required
                value={newEvent.date}
                onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 ring-primary/10 transition-all font-bold text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Venue</label>
              <input 
                type="text" required
                value={newEvent.venue}
                onChange={(e) => setNewEvent({...newEvent, venue: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 ring-primary/10 transition-all font-bold text-sm"
              />
            </div>
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</label>
              <textarea 
                required rows="3"
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 ring-primary/10 transition-all font-bold text-sm"
              />
            </div>
            <div className="sm:col-span-2 flex flex-col sm:flex-row justify-end gap-3">
              <button type="button" onClick={() => {
                setShowAddForm(false);
                setEditingId(null);
                setNewEvent({ title: '', description: '', date: '', venue: '' });
              }} className="px-6 py-3 font-bold text-sm text-gray-500 hover:bg-gray-100 rounded-xl">Cancel</button>
              <button type="submit" className="btn-primary px-8 sm:px-10 shadow-lg shadow-primary/20 uppercase text-[10px] tracking-[0.2em] font-black h-12 w-full sm:w-auto">
                {editingId ? 'Update Event' : 'Schedule Now'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center">
          <Loader2 size={40} className="animate-spin mx-auto text-primary mb-4" />
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Syncing Calendar...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {events.length === 0 ? (
            <div className="sm:col-span-2 lg:col-span-3 p-12 sm:p-20 text-center text-gray-300 font-black uppercase tracking-widest text-[10px]">
              No events scheduled in the near future.
            </div>
          ) : events.map((ev) => (
            <div key={ev._id} className="card overflow-hidden group hover:shadow-2xl hover:shadow-primary/5 transition-all">
              <div className="h-32 bg-gray-50 p-6 flex items-start justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12">
                  <Calendar size={120} />
                </div>
                <div className="bg-white p-3 rounded-2xl shadow-sm text-center min-w-[60px] border border-gray-100 relative z-10">
                  <p className="text-xs font-black text-primary uppercase">{new Date(ev.date).toLocaleString('default', { month: 'short' })}</p>
                  <p className="text-xl font-black text-gray-900">{new Date(ev.date).getDate()}</p>
                </div>
                {isAdmin && (
                  <div className="flex gap-2 relative z-10">
                    <button 
                      onClick={() => handleEdit(ev)}
                      className="p-2 bg-blue-50 text-primary rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(ev._id)}
                      className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
              <div className="p-5 sm:p-8 space-y-4">
                <div>
                  <h3 className="text-lg font-black text-gray-900 tracking-tight mb-1">{ev.title}</h3>
                  <p className="text-xs text-gray-500 font-medium line-clamp-2">{ev.description}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <Clock size={12} className="text-primary" />
                    {new Date(ev.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <MapPin size={12} className="text-primary" />
                    {ev.venue}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <Users size={12} className="text-primary" />
                    {ev.participants?.length || 0} Registered
                  </div>
                </div>
                
                {!isAdmin && (
                  <button 
                    onClick={() => handleRegister(ev._id)}
                    disabled={ev.participants?.includes(user?.id)}
                    className={`w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                      ev.participants?.includes(user?.id)
                        ? 'bg-green-50 text-green-600 cursor-default flex items-center justify-center gap-2'
                        : 'bg-primary text-white hover:bg-accent shadow-lg shadow-primary/20'
                    }`}
                  >
                    {ev.participants?.includes(user?.id) ? (
                      <><CheckCircle size={14} /> Registered</>
                    ) : 'Register for Event'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
