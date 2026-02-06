'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { getPackages, getPaymentStatus } from '@/lib/api';
import type { Package } from '@/lib/api';

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<{ status: string; plan: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getPackages(), getPaymentStatus()])
      .then(([pkgRes, statusRes]) => {
        if (pkgRes.data.success) setPackages(pkgRes.data.data || []);
        if (statusRes.data.success) setPaymentStatus(statusRes.data.data);
      })
      .catch(() => setError('Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProtectedRoute>
      <h1>Packages</h1>
      {paymentStatus && (
        <p style={{ marginBottom: 24, color: '#6b7280' }}>
          Status: {paymentStatus.status} | Plan: {paymentStatus.plan}
        </p>
      )}
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {packages.map((pkg) => (
            <div key={pkg.id} style={{ padding: 16, border: '1px solid #e5e7eb', borderRadius: 8 }}>
              <h3 style={{ margin: '0 0 8px' }}>{pkg.name}</h3>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
                {pkg.currency} {pkg.price}
              </p>
            </div>
          ))}
        </div>
      )}
      {!loading && packages.length === 0 && <p style={{ color: '#6b7280' }}>No packages available.</p>}
    </ProtectedRoute>
  );
}
