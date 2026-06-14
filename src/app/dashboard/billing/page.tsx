"use client";

import React, { useEffect, useState } from 'react';
import { Download, Search, Loader2 } from 'lucide-react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/context/AuthContext';

export default function BillingHistoryPage() {
  const { userData } = useAuth();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInvoices() {
      if (!userData?.uid) return;
      try {
        const q = query(
          collection(db, 'invoices'),
          where('userId', '==', userData.uid),
          orderBy('dueDate', 'desc')
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setInvoices(fetched);
        } else {
          setInvoices([]);
        }
      } catch (err) {
        console.error("Firebase error:", err);
        // Fallback dummy data
        setInvoices([
          { id: 'INV-2026-06-001', month: 'Juni 2026', amount: 250000, due: '20 Jun 2026', status: 'unpaid' },
          { id: 'INV-2026-05-042', month: 'Mei 2026', amount: 250000, due: '20 Mei 2026', status: 'paid' },
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchInvoices();
  }, [userData]);

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-brand-600" /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Riwayat Tagihan</h1>
          <p className="text-slate-500">Daftar lengkap tagihan bulanan layanan WiFi Anda.</p>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
            placeholder="Cari Invoice..."
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  No. Invoice
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Periode Tagihan
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Jatuh Tempo
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Nominal
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="relative px-6 py-4">
                  <span className="sr-only">Aksi</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {invoice.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {invoice.billingMonth?.toDate ? invoice.billingMonth.toDate().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : invoice.month}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {invoice.dueDate?.toDate ? invoice.dueDate.toDate().toLocaleDateString('id-ID') : invoice.due}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-700">
                    Rp {invoice.amount?.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {invoice.status === 'paid' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Lunas
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Belum Bayar
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-slate-400 hover:text-brand-600 transition-colors" title="Download PDF">
                      <Download className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Dummy */}
        <div className="bg-white px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <div className="text-sm text-slate-500">
            Menampilkan <span className="font-medium">1</span> sampai <span className="font-medium">5</span> dari <span className="font-medium">5</span> tagihan
          </div>
          <div className="flex gap-2">
            <button disabled className="px-3 py-1 border border-slate-200 rounded-md text-sm text-slate-400 cursor-not-allowed">
              Sebelumnya
            </button>
            <button disabled className="px-3 py-1 border border-slate-200 rounded-md text-sm text-slate-400 cursor-not-allowed">
              Berikutnya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
