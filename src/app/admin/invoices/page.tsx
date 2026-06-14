"use client";

import React, { useEffect, useState } from 'react';
import { Search, Plus, Filter, Eye, Download, Loader2, X } from 'lucide-react';
import { collection, getDocs, query, orderBy, addDoc, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [formData, setFormData] = useState({ userId: '', customerName: '', amount: 250000, dueDate: '' });

  useEffect(() => {
    fetchInvoices();
  }, []);

  async function fetchInvoices() {
    setLoading(true);
    try {
      const q = query(collection(db, 'invoices'), orderBy('dueDate', 'desc'));
      const snapshot = await getDocs(q);
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInvoices(fetched);
    } catch (err) {
      console.error("Firebase error:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAdd = async () => {
    setIsModalOpen(true);
    // Fetch customers for the dropdown
    try {
      const q = query(collection(db, 'users'), where('role', '==', 'customer'));
      const snapshot = await getDocs(q);
      setCustomers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("Failed to load customers:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userId) return alert("Pilih pelanggan terlebih dahulu");
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'invoices'), {
        userId: formData.userId,
        customerName: formData.customerName,
        amount: Number(formData.amount),
        dueDate: new Date(formData.dueDate),
        billingMonth: new Date(),
        status: 'unpaid',
        createdAt: new Date().toISOString()
      });
      setIsModalOpen(false);
      setFormData({ userId: '', customerName: '', amount: 250000, dueDate: '' });
      fetchInvoices();
    } catch (err) {
      alert("Gagal membuat tagihan.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const custId = e.target.value;
    const cust = customers.find(c => c.id === custId);
    setFormData({ ...formData, userId: custId, customerName: cust?.name || '' });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Tagihan</h1>
          <p className="text-slate-500">Pantau status pembayaran dan buat invoice untuk pelanggan.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-semibold hover:bg-slate-50 transition-colors shadow-sm">
            <Filter className="w-5 h-5" />
            Filter
          </button>
          <button onClick={handleOpenAdd} className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-brand-700 transition-colors shadow-sm">
            <Plus className="w-5 h-5" />
            Buat Tagihan
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
              placeholder="Cari ID Invoice atau nama pelanggan..."
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-brand-600" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">ID Invoice</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Pelanggan</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Nominal</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Jatuh Tempo</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="relative px-6 py-4"><span className="sr-only">Aksi</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {invoices.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-10 text-center text-slate-500">Belum ada data tagihan.</td></tr>
                ) : invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">{invoice.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{invoice.customerName || invoice.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700">Rp {invoice.amount?.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {invoice.dueDate?.toDate ? invoice.dueDate.toDate().toLocaleDateString('id-ID') : invoice.due}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {invoice.status === 'paid' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">Lunas</span>}
                      {invoice.status === 'unpaid' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">Belum Bayar</span>}
                      {invoice.status === 'overdue' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">Terlambat</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-3">
                        <button className="text-slate-400 hover:text-brand-600 transition-colors" title="Lihat Detail"><Eye className="w-5 h-5" /></button>
                        <button className="text-slate-400 hover:text-brand-600 transition-colors" title="Download PDF"><Download className="w-5 h-5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Tambah Tagihan */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-2xl shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-bold text-slate-900">Buat Tagihan Baru</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-500"><X className="w-6 h-6" /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Pilih Pelanggan</label>
                  <select required value={formData.userId} onChange={handleCustomerChange} className="w-full border-slate-300 rounded-xl px-4 py-2 text-slate-900 border focus:ring-brand-500 focus:border-brand-500">
                    <option value="" disabled>-- Pilih Pelanggan --</option>
                    {customers.map(cust => (
                      <option key={cust.id} value={cust.id}>{cust.name} ({cust.email})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nominal Tagihan (Rp)</label>
                  <input required type="number" min="0" value={formData.amount} onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})} className="w-full border-slate-300 rounded-xl px-4 py-2 text-slate-900 border focus:ring-brand-500 focus:border-brand-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Jatuh Tempo</label>
                  <input required type="date" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} className="w-full border-slate-300 rounded-xl px-4 py-2 text-slate-900 border focus:ring-brand-500 focus:border-brand-500" />
                </div>
                
                <div className="mt-6 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">Batal</button>
                  <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 disabled:opacity-50">{isSubmitting ? 'Membuat...' : 'Buat Tagihan'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
