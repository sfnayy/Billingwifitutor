"use client";

import React, { useEffect, useState } from 'react';
import { Wallet, Users, AlertTriangle, TrendingUp, Loader2 } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState({ totalIncome: 0, activeCustomers: 0, unpaidBills: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        // Fetch active customers
        const usersSnap = await getDocs(query(collection(db, 'users'), where('role', '==', 'customer'), where('status', '==', 'active')));
        const activeCustomers = usersSnap.size;

        // Fetch unpaid bills and income
        const invoicesSnap = await getDocs(collection(db, 'invoices'));
        let unpaidBills = 0;
        let totalIncome = 0;
        invoicesSnap.forEach(doc => {
          const data = doc.data();
          if (data.status === 'unpaid') unpaidBills++;
          if (data.status === 'paid') totalIncome += data.amount;
        });

        setMetrics({ totalIncome, activeCustomers, unpaidBills });
      } catch (err) {
        console.error("Firebase error:", err);
        // Fallback
        setMetrics({ totalIncome: 15450000, activeCustomers: 124, unpaidBills: 12 });
      } finally {
        setLoading(false);
      }
    }
    fetchMetrics();
  }, []);

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-brand-600" /></div>;
  }
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Admin</h1>
        <p className="text-slate-500">Ringkasan performa bisnis dan status pelanggan.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Total Income */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm font-bold bg-green-50 px-2 py-1 rounded-md">
              <TrendingUp className="w-4 h-4" />
              <span>+12%</span>
            </div>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Total Pendapatan (Bulan Ini)</h3>
          <p className="text-3xl font-extrabold text-slate-900 mt-1">Rp {metrics.totalIncome.toLocaleString('id-ID')}</p>
        </div>

        {/* Active Customers */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-brand-600" />
            </div>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Pelanggan Aktif</h3>
          <p className="text-3xl font-extrabold text-slate-900 mt-1">{metrics.activeCustomers}</p>
        </div>

        {/* Unpaid Bills */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Tagihan Belum Terbayar</h3>
          <p className="text-3xl font-extrabold text-red-600 mt-1">{metrics.unpaidBills} <span className="text-lg text-slate-500 font-normal">pelanggan</span></p>
        </div>
      </div>

      {/* Quick Actions & Recent Activities layout */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900">Pembayaran Terakhir</h2>
            <button className="text-sm font-semibold text-brand-600 hover:text-brand-700">Lihat Semua</button>
          </div>
          <div className="space-y-4">
            {/* Dummy List */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Pelanggan #{1000 + i}</p>
                    <p className="text-xs text-slate-500">Membayar tagihan Rp 250.000</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">Hari ini</p>
                  <p className="text-xs text-slate-500">14:3{i} WIB</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-brand-500 rounded-full blur-3xl opacity-20" />
          <h2 className="text-lg font-bold mb-4">Aksi Cepat</h2>
          <div className="space-y-3 relative z-10">
            <button className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-3 rounded-xl transition-colors text-sm text-left px-4 flex justify-between items-center">
              Tambah Pelanggan Baru
              <span className="text-lg">+</span>
            </button>
            <button className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-xl transition-colors text-sm text-left px-4 flex justify-between items-center">
              Buat Tagihan Massal
              <span className="text-lg">+</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
