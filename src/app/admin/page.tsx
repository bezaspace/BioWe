'use client';

import { useAuth } from '@/context/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type AdminUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  creationTime: string | null;
  lastSignInTime: string | null;
  disabled: boolean;
};

export default function AdminDashboard() {
  const { user, loading, getIdToken } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;
      setUsersLoading(true);
      setUsersError(null);
      try {
        const token = await getIdToken();
        if (!token) throw new Error('No ID token found');
        const res = await fetch('/api/admin/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to fetch users');
        }
        const data = await res.json();
        setUsers(data.users);
      } catch (err: any) {
        setUsersError(err.message || 'Unknown error');
      } finally {
        setUsersLoading(false);
      }
    };
    if (user) {
      fetchUsers();
    }
  }, [user, getIdToken]);

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Welcome, {user.displayName || 'Admin'}! 👋
          </h2>
          <p className="text-gray-600">
            This is your admin dashboard.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">All Users</h2>
          {usersLoading ? (
            <div>Loading users...</div>
          ) : usersError ? (
            <div className="text-red-600">Error: {usersError}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 border">UID</th>
                    <th className="px-4 py-2 border">Email</th>
                    <th className="px-4 py-2 border">Display Name</th>
                    <th className="px-4 py-2 border">Created</th>
                    <th className="px-4 py-2 border">Last Sign In</th>
                    <th className="px-4 py-2 border">Disabled</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.uid}>
                      <td className="px-4 py-2 border">{u.uid}</td>
                      <td className="px-4 py-2 border">{u.email || '-'}</td>
                      <td className="px-4 py-2 border">{u.displayName || '-'}</td>
                      <td className="px-4 py-2 border">{u.creationTime ? new Date(u.creationTime).toLocaleString() : '-'}</td>
                      <td className="px-4 py-2 border">{u.lastSignInTime ? new Date(u.lastSignInTime).toLocaleString() : '-'}</td>
                      <td className="px-4 py-2 border">{u.disabled ? 'Yes' : 'No'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <div className="text-gray-500 mt-4">No users found.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
