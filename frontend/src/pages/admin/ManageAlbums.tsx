import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { api } from '../../services/api';
import { Trash2, Image as ImageIcon, Video, Plus, Link as LinkIcon } from 'lucide-react';
import { Event } from '../../types';

interface AlbumMedia {
  id: number;
  mediaUrl: string;
  mediaType: 'IMAGE' | 'VIDEO';
  createdAt: string;
}

export const ManageAlbums = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [mediaList, setMediaList] = useState<AlbumMedia[]>([]);
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaType, setNewMediaType] = useState<'IMAGE' | 'VIDEO'>('IMAGE');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      fetchMediaForEvent(selectedEventId);
    } else {
      setMediaList([]);
    }
  }, [selectedEventId]);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Failed to fetch events', error);
    }
  };

  const fetchMediaForEvent = async (eventId: string) => {
    try {
      const response = await api.get(`/events/${eventId}/media`);
      setMediaList(response.data);
    } catch (error) {
      console.error('Failed to fetch media', error);
    }
  };

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId || !newMediaUrl) return;

    setLoading(true);
    try {
      await api.post(`/events/${selectedEventId}/media`, {
        mediaUrl: newMediaUrl,
        mediaType: newMediaType
      });
      setNewMediaUrl('');
      fetchMediaForEvent(selectedEventId);
    } catch (error) {
      console.error('Failed to add media', error);
      alert('Failed to add media. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMedia = async (mediaId: number) => {
    if (!window.confirm('Delete this media from the album?')) return;
    try {
      await api.delete(`/events/${selectedEventId}/media/${mediaId}`);
      setMediaList(mediaList.filter(m => m.id !== mediaId));
    } catch (error) {
      console.error('Failed to delete media', error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Manage Event Albums</h2>

      <Card className="p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select Event</label>
          <select 
            className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
          >
            <option value="">-- Choose an Event --</option>
            {events.map(event => (
              <option key={event.id} value={event.id}>{event.title} - {new Date(event.date).toLocaleDateString()}</option>
            ))}
          </select>
        </div>

        {selectedEventId && (
          <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Add Media</h3>
            <form onSubmit={handleAddMedia} className="flex gap-4 items-start">
              <div className="flex-1">
                <Input
                  icon={<LinkIcon className="w-5 h-5" />}
                  placeholder="Paste Cloudinary URL or direct media link..."
                  value={newMediaUrl}
                  onChange={(e) => setNewMediaUrl(e.target.value)}
                  required
                />
                <p className="text-xs text-slate-500 mt-2">
                  To use Cloudinary, upload your file there and paste the secure URL here.
                </p>
              </div>
              <div className="w-48">
                <select 
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  value={newMediaType}
                  onChange={(e) => setNewMediaType(e.target.value as 'IMAGE' | 'VIDEO')}
                >
                  <option value="IMAGE">Image</option>
                  <option value="VIDEO">Video</option>
                </select>
              </div>
              <Button type="submit" disabled={loading || !newMediaUrl}>
                <Plus className="w-5 h-5 mr-2" /> Add
              </Button>
            </form>
          </div>
        )}
      </Card>

      {selectedEventId && (
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Current Album</h3>
          {mediaList.length === 0 ? (
            <Card className="p-8 text-center text-slate-500">
              No media found for this event.
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mediaList.map((media) => (
                <div key={media.id} className="relative group rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 aspect-video border border-slate-200 dark:border-slate-800">
                  {media.mediaType === 'IMAGE' ? (
                    <img src={media.mediaUrl} alt="Album" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-900">
                      <Video className="w-12 h-12 text-slate-400" />
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => handleDeleteMedia(media.id)}
                      className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors transform scale-0 group-hover:scale-100 duration-200"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Icon badge */}
                  <div className="absolute top-2 left-2 p-1.5 bg-black/50 backdrop-blur-sm rounded-md text-white">
                    {media.mediaType === 'IMAGE' ? <ImageIcon className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
