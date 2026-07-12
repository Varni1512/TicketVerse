import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Trash2, Mail, Calendar, User } from 'lucide-react';
import { api } from '../../services/api';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export const ViewContacts = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const response = await api.get('/contact');
      // Sort by newest first
      const sorted = response.data.sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setMessages(sorted);
    } catch (error) {
      console.error('Failed to fetch messages', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    try {
      await api.delete(`/contact/${id}`);
      setMessages(messages.filter(m => m.id !== id));
    } catch (error) {
      console.error('Failed to delete message', error);
      alert('Failed to delete message');
    }
  };

  if (loading) return <div className="p-8">Loading messages...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Contact Messages</h2>
      </div>

      {messages.length === 0 ? (
        <Card className="p-8 text-center">
          <Mail className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">No messages yet</h3>
          <p className="text-slate-500 mt-2">When users submit the contact form, their messages will appear here.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <Card key={msg.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{msg.subject}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
                    <span className="flex items-center gap-1"><User className="w-4 h-4" /> {msg.name}</span>
                    <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {msg.email}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(msg.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/10"
                  onClick={() => handleDelete(msg.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{msg.message}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
