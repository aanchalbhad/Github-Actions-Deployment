'use client';

import { useCallback, useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { createSubject, deleteSubject, getSubjects, updateSubject } from '@/lib/api';
import type { Subject } from '@/lib/api';

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addName, setAddName] = useState('');
  const [addCode, setAddCode] = useState('');
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCode, setEditCode] = useState('');

  const load = useCallback(() => {
    getSubjects()
      .then((res) => {
        if (res.data.success) setSubjects(res.data.data || []);
      })
      .catch(() => setError('Failed to load subjects'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => load(), [load]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim()) return;
    setError('');
    setAdding(true);
    try {
      await createSubject({ name: addName.trim(), code: addCode.trim() || undefined });
      setAddName('');
      setAddCode('');
      load();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Failed to create subject');
    } finally {
      setAdding(false);
    }
  };

  const startEdit = (s: Subject) => {
    setEditingId(s._id);
    setEditName(s.name);
    setEditCode(s.code);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditCode('');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setError('');
    try {
      await updateSubject(editingId, { name: editName.trim(), code: editCode.trim() || undefined });
      cancelEdit();
      load();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Failed to update subject');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this subject?')) return;
    setError('');
    try {
      await deleteSubject(id);
      load();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Failed to delete subject');
    }
  };

  return (
    <ProtectedRoute>
      <h1>Subjects</h1>
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        <input placeholder="Name" value={addName} onChange={(e) => setAddName(e.target.value)} required style={{ width: 160 }} />
        <input placeholder="Code (optional)" value={addCode} onChange={(e) => setAddCode(e.target.value)} style={{ width: 160 }} />
        <button type="submit" disabled={adding}>
          {adding ? 'Adding...' : 'Add'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ textAlign: 'left', padding: 12 }}>Name</th>
              <th style={{ textAlign: 'left', padding: 12 }}>Code</th>
              <th style={{ padding: 12 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((s) => (
              <tr key={s._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                {editingId === s._id ? (
                  <td colSpan={3} style={{ padding: 12 }}>
                    <form onSubmit={handleUpdate} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input value={editName} onChange={(e) => setEditName(e.target.value)} required style={{ width: 160 }} />
                      <input value={editCode} onChange={(e) => setEditCode(e.target.value)} style={{ width: 120 }} />
                      <button type="submit">Save</button>
                      <button type="button" onClick={cancelEdit} style={{ background: '#6b7280' }}>
                        Cancel
                      </button>
                    </form>
                  </td>
                ) : (
                  <>
                    <td style={{ padding: 12 }}>{s.name}</td>
                    <td style={{ padding: 12 }}>{s.code}</td>
                    <td style={{ padding: 12 }}>
                      <button type="button" onClick={() => startEdit(s)} style={{ marginRight: 8, padding: '4px 8px', fontSize: 14 }}>
                        Edit
                      </button>
                      <button type="button" onClick={() => handleDelete(s._id)} style={{ background: '#dc2626', padding: '4px 8px', fontSize: 14 }}>
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {!loading && subjects.length === 0 && <p style={{ color: '#6b7280' }}>No subjects yet. Add one above.</p>}
    </ProtectedRoute>
  );
}
