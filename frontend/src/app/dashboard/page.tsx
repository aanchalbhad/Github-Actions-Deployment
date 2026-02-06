'use client';

import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.firstName || user?.userName}.</p>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 24 }}>
        <Link href="/profile" style={{ padding: 16, border: '1px solid #e5e7eb', borderRadius: 8, minWidth: 160 }}>
          Profile
        </Link>
        <Link href="/subjects" style={{ padding: 16, border: '1px solid #e5e7eb', borderRadius: 8, minWidth: 160 }}>
          Subjects
        </Link>
        <Link href="/packages" style={{ padding: 16, border: '1px solid #e5e7eb', borderRadius: 8, minWidth: 160 }}>
          Packages
        </Link>
      </div>
    </ProtectedRoute>
  );
}
