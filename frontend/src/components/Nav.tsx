'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export function Nav() {
  const { token, user, logout } = useAuth();

  const navStyle = { padding: '12px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: 16, alignItems: 'center' as const };

  return (
    <div style={navStyle}>
      <Link href="/" style={{ fontWeight: 600, textDecoration: 'none', color: '#111' }}>
        Fractal
      </Link>
      {token ? (
        <>
          <Link href="/dashboard" style={{ textDecoration: 'none', color: '#374151' }}>Dashboard</Link>
          <Link href="/profile" style={{ textDecoration: 'none', color: '#374151' }}>Profile</Link>
          <Link href="/subjects" style={{ textDecoration: 'none', color: '#374151' }}>Subjects</Link>
          <Link href="/packages" style={{ textDecoration: 'none', color: '#374151' }}>Packages</Link>
          <span style={{ marginLeft: 'auto', fontSize: 14, color: '#6b7280' }}>
            {user?.email} ({user?.userRole})
          </span>
          <button type="button" onClick={logout} style={{ padding: '6px 12px', cursor: 'pointer', border: '1px solid #d1d5db', borderRadius: 6, background: '#fff' }}>
            Logout
          </button>
        </>
      ) : (
        <>
          <Link href="/login" style={{ marginLeft: 'auto', textDecoration: 'none', color: '#374151' }}>Login</Link>
          <Link href="/register" style={{ textDecoration: 'none', color: '#374151' }}>Register</Link>
        </>
      )}
    </div>
  );
}
