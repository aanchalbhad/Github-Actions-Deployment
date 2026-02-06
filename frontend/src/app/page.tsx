'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { token, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (token) router.replace('/dashboard');
    }
  }, [token, loading, router]);

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ textAlign: 'center', padding: 48 }}>
      <h1>Fractal</h1>
      <p style={{ color: '#6b7280', marginBottom: 24 }}>Welcome. Sign in or create an account.</p>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
        <Link href="/login" style={{ padding: '12px 24px', background: '#2563eb', color: 'white', borderRadius: 8 }}>
          Login
        </Link>
        <Link href="/register" style={{ padding: '12px 24px', border: '1px solid #d1d5db', borderRadius: 8 }}>
          Register
        </Link>
      </div>
    </div>
  );
}
