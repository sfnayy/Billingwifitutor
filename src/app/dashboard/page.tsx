"use client";

import React, { useEffect, useState } from 'react';
import { ShieldCheck, Zap, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { userData } = useAuth();
  const [unpaidBill, setUnpaidBill] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!userData?.uid) return;
      try {
        const q = query(
          collection(db, 'invoices'),
          where('userId', '==', userData.uid),
          where('status', '==', 'unpaid'),
          orderBy('dueDate', 'asc'),
          limit(1)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setUnpaidBill({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
        }
      } catch (err) {
        console.error("Firebase error (maybe config is missing):", err);
        // Fallback for demo
        setUnpaidBill({
          amount: 250000,
          dueDate: { toDate: () => new Date('2026-06-20') }
        });
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, [userData]);

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-brand-600" /></div>;
  }
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Ringkasan Layanan</h1>
        <p className="text-slate-500">Pantau status koneksi dan tagihan WiFi Anda.</p>
      </div>

      {/* Alert if there is unpaid bill */}
      {unpaidBill && (
        <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 items-start">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-red-800">Tagihan Belum Dibayar</h3>
            <p className="text-sm text-red-700 mt-1">
              Anda memiliki tagihan yang belum dibayar sebesar <strong>Rp {unpaidBill.amount?.toLocaleString('id-ID')}</strong>. Jatuh tempo: <strong>{unpaidBill.dueDate?.toDate ? unpaidBill.dueDate.toDate().toLocaleDateString('id-ID') : 'Segera'}</strong>.
            </p>
            <div className="mt-3">
              <Link 
                href="/dashboard/payment" 
                className="text-sm font-semibold bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Bayar Sekarang
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Status Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-green-600" />
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wide">
              Aktif
            </span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Status Koneksi</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">Terhubung</p>
        </div>

        {/* Speed Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-brand-600" />
            </div>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Paket Langganan</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">Pro 50 Mbps</p>
        </div>

        {/* Next Due Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Jatuh Tempo Berikutnya</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">20 Juni 2026</p>
        </div>
      </div>

      {/* Quick Action / Info */}
      <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-500 rounded-full blur-3xl opacity-20" />
        <h2 className="text-xl font-bold mb-2">Butuh Bantuan Teknis?</h2>
        <p className="text-slate-400 mb-6 max-w-md">
          Tim teknisi kami siap membantu Anda jika mengalami gangguan koneksi atau penurunan kecepatan.
        </p>
        <button className="bg-white text-slate-900 px-6 py-2.5 rounded-lg font-semibold hover:bg-slate-100 transition-colors">
          Hubungi Support
        </button>
      </div>
    </div>
  );
}
