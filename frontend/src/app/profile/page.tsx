'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { getProfile, updateProfile } from '@/lib/api';

export default function ProfilePage() {
  const { user, refreshProfile } = useAuth();
  const [form, setForm] = useState({ firstName: '', lastName: '', userName: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProfile()
      .then((res) => {
        if (res.data.success && res.data.data) {
          const u = res.data.data;
          setForm({ firstName: u.firstName, lastName: u.lastName, userName: u.userName });
        }
      })
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await updateProfile(form);
      await refreshProfile();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <h1>Profile</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
          <div className="form-group">
            <label htmlFor="userName">Username</label>
            <input id="userName" name="userName" value={form.userName} onChange={handleChange} required style={{ width: '100%' }} />
          </div>
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input id="firstName" name="firstName" value={form.firstName} onChange={handleChange} required style={{ width: '100%' }} />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} required style={{ width: '100%' }} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input value={user?.email || ''} readOnly disabled style={{ width: '100%', background: '#f9fafb', color: '#6b7280' }} />
          </div>
          <div className="form-group">
            <label>Role</label>
            <input value={user?.userRole || ''} readOnly disabled style={{ width: '100%', background: '#f9fafb', color: '#6b7280' }} />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </form>
      )}
    </ProtectedRoute>
  );
}
