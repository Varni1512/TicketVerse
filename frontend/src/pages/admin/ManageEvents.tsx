import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { SeatBuilder, SeatDefinition } from '../../components/admin/SeatBuilder';
import { api } from '../../services/api';
import { eventService } from '../../services/eventService';
import { Event } from '../../types';
import { Calendar, MapPin, Tag, Plus, Trash2, Edit } from 'lucide-react';

export const ManageEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    category: '',
    venue: '',
    city: '',
    eventDate: '',
    startTime: '20:00',
    imageUrl: '',
    status: 'UPCOMING'
  });

  const [vipPrice, setVipPrice] = useState<number>(150);
  const [regularPrice, setRegularPrice] = useState<number>(50);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [seats, setSeats] = useState<SeatDefinition[]>([]);
  const [existingSeats, setExistingSeats] = useState<SeatDefinition[]>([]);
  const [step, setStep] = useState<1 | 2>(1);
  const [submitAction, setSubmitAction] = useState<'update' | 'next'>('next');

  const fetchEvents = async () => {
    setEventsLoading(true);
    try {
      const data = await eventService.getEvents();
      setEvents(data || []);
    } catch (error) {
      console.error('Failed to fetch events', error);
    } finally {
      setEventsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await api.delete(`/events/${id}`);
        fetchEvents();
      } catch (error) {
        console.error('Failed to delete event', error);
        alert('Failed to delete event');
      }
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEventId(event.id);
    
    const eventDate = Array.isArray(event.eventDate) ? `${event.eventDate[0]}-${String(event.eventDate[1]).padStart(2, '0')}-${String(event.eventDate[2]).padStart(2, '0')}` : (event.eventDate || '');
    const startTimeStr = Array.isArray(event.startTime) ? `${String(event.startTime[0]).padStart(2, '0')}:${String(event.startTime[1]).padStart(2, '0')}` : (event.startTime || '20:00');
    const startTime = startTimeStr.substring(0, 5);

    setEventData({
      title: event.title || '',
      description: event.description || '',
      category: event.category || '',
      venue: event.venue || '',
      city: event.city || '',
      eventDate: eventDate,
      startTime: startTime,
      imageUrl: event.imageUrl || '',
      status: event.status || 'UPCOMING'
    });
    setStep(1);
    setIsFormOpen(true);
  };

  const handleUpdateEvent = async () => {
    if (!editingEventId) return;
    setLoading(true);
    try {
      let uploadedImageUrl = eventData.imageUrl;
      
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        
        const uploadRes = await api.post('/events/upload-image', formData);
        uploadedImageUrl = typeof uploadRes.data === 'string' ? uploadRes.data : uploadRes.data.url;
      }

      const eventPayload = { ...eventData, imageUrl: uploadedImageUrl };
      await api.put(`/events/${editingEventId}`, eventPayload);
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setIsFormOpen(false);
        setEditingEventId(null);
        fetchEvents();
        
        setEventData({
          title: '', description: '', category: '', venue: '', city: '', 
          eventDate: '', startTime: '20:00', imageUrl: '', status: 'UPCOMING'
        });
        setImageFile(null);
      }, 2000);
      
    } catch (error: any) {
      console.error("Failed to update event", error);
      alert(`Failed to update event. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleNextToSeating = async () => {
    if (editingEventId) {
      setLoading(true);
      try {
        const res = await api.get(`/events/${editingEventId}/seats`);
        setExistingSeats(res.data);
        setStep(2);
      } catch (error) {
        console.error("Failed to fetch seats", error);
        alert("Failed to load existing seating layout.");
      } finally {
        setLoading(false);
      }
    } else {
      setStep(2);
    }
  };

  const handleCreateEventAndSeats = async () => {
    if (seats.length === 0) {
      alert("Please save the seat layout first.");
      return;
    }

    setLoading(true);
    try {
      let uploadedImageUrl = eventData.imageUrl;
      
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        
        const uploadRes = await api.post('/events/upload-image', formData);
        uploadedImageUrl = typeof uploadRes.data === 'string' ? uploadRes.data : uploadRes.data.url;
      }

      const eventPayload = { ...eventData, imageUrl: uploadedImageUrl };
      
      let eventId = editingEventId;
      if (editingEventId) {
        await api.put(`/events/${editingEventId}`, eventPayload);
        
        const newSeats = seats.filter(newSeat => {
          return !existingSeats.some(ex => ex.rowNum === newSeat.rowNum && ex.seatNumber === newSeat.seatNumber);
        });
        
        if (newSeats.length > 0) {
          await api.post(`/events/${eventId}/seats/bulk`, newSeats);
        }
      } else {
        const eventRes = await api.post('/events', eventPayload);
        eventId = eventRes.data.id;
        await api.post(`/events/${eventId}/seats/bulk`, seats);
      }
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setIsFormOpen(false); // Close form
        setEditingEventId(null);
        fetchEvents(); // Refresh list
        
        // Reset form
        setStep(1);
        setEventData({
          title: '', description: '', category: '', venue: '', city: '', 
          eventDate: '', startTime: '20:00', imageUrl: '', status: 'UPCOMING'
        });
        setSeats([]);
        setExistingSeats([]);
        setImageFile(null);
        setVipPrice(150);
        setRegularPrice(50);
      }, 2000);
      
    } catch (error: any) {
      console.error("Failed to save event or seats", error, error.response?.data);
      const errorMsg = error.response?.data ? JSON.stringify(error.response.data) : error.message;
      alert(`Failed to save event. Details: ${errorMsg}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Manage Events</h2>
        
        {!isFormOpen && (
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Event
          </Button>
        )}
        
        {isFormOpen && (
          <div className="flex gap-2">
             {!editingEventId ? (
               <>
                 <div className={`px-4 py-2 rounded-full text-sm font-medium ${step === 1 ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-500'}`}>1. Details</div>
                 <div className={`px-4 py-2 rounded-full text-sm font-medium ${step === 2 ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-500'}`}>2. Seating</div>
               </>
             ) : (
                 <div className="px-4 py-2 rounded-full text-sm font-medium bg-primary-600 text-white">Edit Details</div>
             )}
             <Button variant="outline" onClick={() => { setIsFormOpen(false); setEditingEventId(null); }}>Cancel</Button>
          </div>
        )}
      </div>

      {success && (
        <div className="p-4 bg-green-100 text-green-700 rounded-lg border border-green-200">
          Event and Seats successfully created!
        </div>
      )}

      {!isFormOpen ? (
        <Card className="p-0 overflow-hidden">
          {eventsLoading ? (
            <div className="p-8 text-center text-slate-500">Loading events...</div>
          ) : events.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No events found. Click "Add Event" to create one.</div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {events?.map((event) => (
                <div key={event.id} className="p-4 md:p-6 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <img src={event.imageUrl || 'https://via.placeholder.com/100'} alt={event.title} className="w-16 h-16 rounded-lg object-cover bg-slate-200" />
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg">{event.title}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                        <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1" /> {event.eventDate ? (Array.isArray(event.eventDate) ? new Date(event.eventDate[0], event.eventDate[1]-1, event.eventDate[2]).toLocaleDateString() : new Date(event.eventDate).toLocaleDateString()) : 'TBD'}</span>
                        <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1" /> {event.city}</span>
                        <span className="flex items-center"><Tag className="w-3.5 h-3.5 mr-1" /> {event.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(event)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30" onClick={() => handleDelete(event.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      ) : (
        <>
          {step === 1 && (
            <Card className="p-6 animate-fade-in">
              <form className="space-y-6" onSubmit={(e) => { 
                e.preventDefault(); 
                if (submitAction === 'update') {
                  handleUpdateEvent();
                } else {
                  handleNextToSeating();
                }
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <Input label="Event Title" name="title" value={eventData.title} onChange={handleChange} required />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</label>
                    <textarea 
                      name="description"
                      value={eventData.description}
                      onChange={handleChange}
                      className="w-full h-32 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      required
                    />
                  </div>

                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category</label>
                    <div className="relative">
                      <select 
                        name="category" 
                        value={eventData.category} 
                        onChange={handleChange} 
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 appearance-none"
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Music">Music</option>
                        <option value="Comedy">Comedy</option>
                        <option value="Sports">Sports</option>
                        <option value="Theater">Theater</option>
                        <option value="Tech">Tech</option>
                        <option value="Party">Party</option>
                        <option value="Festival">Festival</option>
                        <option value="Workshop">Workshop</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                         <Tag className="w-5 h-5 text-slate-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Cover Image File</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    />
                  </div>
                  
                  <div className="col-span-2 md:col-span-1">
                    <Input label="Regular Ticket Price (₹)" type="number" name="regularPrice" value={regularPrice} onChange={(e) => setRegularPrice(Number(e.target.value))} required />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <Input label="VIP Ticket Price (₹)" type="number" name="vipPrice" value={vipPrice} onChange={(e) => setVipPrice(Number(e.target.value))} required />
                  </div>
                  
                  <Input label="Venue" name="venue" icon={<MapPin className="w-5 h-5"/>} value={eventData.venue} onChange={handleChange} required />
                  <Input label="City" name="city" value={eventData.city} onChange={handleChange} required />
                  
                  <Input label="Event Date" type="date" name="eventDate" value={eventData.eventDate} onChange={handleChange} required />
                  <Input label="Start Time" type="time" name="startTime" value={eventData.startTime} onChange={handleChange} required />
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800 gap-4">
                   {editingEventId && (
                     <Button type="submit" variant="outline" onClick={() => setSubmitAction('update')} disabled={loading}>
                       Update Details Only
                     </Button>
                   )}
                   <Button type="submit" onClick={() => setSubmitAction('next')} disabled={loading}>
                     {editingEventId ? 'Next: Add More Seats' : 'Next: Build Seating Layout'}
                   </Button>
                </div>
              </form>
            </Card>
          )}

          {step === 2 && (
            <Card className="p-6 animate-fade-in">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Interactive Seat Builder</h3>
              
              <SeatBuilder onSave={(savedSeats) => setSeats(savedSeats)} vipPrice={vipPrice} regularPrice={regularPrice} initialSeats={existingSeats} />

              <div className="mt-8 flex justify-between items-center pt-6 border-t border-slate-200 dark:border-slate-800">
                <Button variant="outline" onClick={() => setStep(1)}>Back to Details</Button>
                
                <div className="flex items-center gap-4">
                  {seats.length > 0 && (
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      {seats.length} seats generated and ready!
                    </span>
                  )}
                  <Button 
                    onClick={handleCreateEventAndSeats} 
                    disabled={loading || seats.length === 0}
                  >
                    {loading ? 'Saving...' : editingEventId ? 'Save Updates' : 'Publish Event'}
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
};
