import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';
import { Shield, ShieldAlert, User as UserIcon } from 'lucide-react';

export const ManageUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data || []);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePromote = async (id: string) => {
    if (window.confirm('Are you sure you want to promote this user to ADMIN?')) {
      try {
        await api.put(`/users/${id}/role`, { role: 'ADMIN' });
        fetchUsers();
      } catch (error) {
        console.error('Failed to update role', error);
        alert('Failed to promote user.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Manage Users</h2>
      
      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No users found.</div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {users.map((user) => (
              <div key={user.id} className="p-4 md:p-6 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                    <UserIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                      {user.firstName} {user.lastName}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                      <span>{user.email}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>
                
                {user.role !== 'ADMIN' ? (
                  <Button variant="outline" size="sm" onClick={() => handlePromote(user.id)} className="text-primary-600 hover:text-primary-700 hover:bg-primary-50 dark:hover:bg-primary-950/30">
                    <ShieldAlert className="w-4 h-4 mr-2" /> Make Admin
                  </Button>
                ) : (
                  <div className="flex items-center text-green-600 dark:text-green-500 font-medium text-sm">
                    <Shield className="w-4 h-4 mr-2" /> Admin Verified
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
