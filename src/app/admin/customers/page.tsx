"use client";

import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit2, Trash2, MoreVertical, Loader2, X, AlertCircle } from 'lucide-react';
import { collection, getDocs, query, where, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', plan: 'Paket Basic 20 Mbps', status: 'active' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    setLoading(true);
    try {
      const q = query(collection(db, 'users'), where('role', '==', 'customer'));
      const snapshot = await getDocs(q);
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCustomers(fetched);
    } catch (err) {
      console.error("Firebase error:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAdd = () => {
    setFormData({ name: '', email: '', plan: 'Paket Basic 20 Mbps', status: 'active' });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (customer: any) => {
    setFormData({ name: customer.name, email: customer.email, plan: customer.plan || 'Paket Basic 20 Mbps', status: customer.status || 'active' });
    setCurrentId(customer.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus pelanggan ini?")) return;
    try {
      await deleteDoc(doc(db, 'users', id));
      fetchCustomers();
    } catch (err) {
      alert("Gagal menghapus pelanggan.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateDoc(doc(db, 'users', currentId), {
          ...formData
        });
      } else {
        // Warning: This only adds data, not Auth. Admin should be aware.
        await addDoc(collection(db, 'users'), {
          ...formData,
          role: 'customer',
          createdAt: new Date().toISOString()
        });
      }
      setIsModalOpen(false);
      fetchCustomers();
    } catch (err) {
      alert("Gagal menyimpan data.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Pelanggan</h1>
          <p className="text-slate-500">Kelola data pelanggan, paket langganan, dan status aktif.</p>
        </div>
        
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-brand-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Tambah Pelanggan
        </button>
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
              placeholder="Cari nama, email, atau ID..."
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
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Pelanggan</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Paket</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="relative px-6 py-4"><span className="sr-only">Aksi</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {customers.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-500">Belum ada pelanggan terdaftar.</td></tr>
                ) : customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{customer.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{customer.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{customer.plan || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {customer.status === 'active' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">Aktif</span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">Suspended</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => handleOpenEdit(customer)} className="text-slate-400 hover:text-brand-600 transition-colors" title="Edit"><Edit2 className="w-5 h-5" /></button>
                        <button onClick={() => handleDelete(customer.id)} className="text-slate-400 hover:text-red-600 transition-colors" title="Hapus"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-2xl shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-bold text-slate-900">{isEditing ? 'Edit Pelanggan' : 'Tambah Data Pelanggan'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-500"><X className="w-6 h-6" /></button>
              </div>
              
              {!isEditing && (
                <div className="mb-4 bg-blue-50 text-blue-800 text-xs p-3 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>Membuat pelanggan di sini hanya menambahkan data penagihan. Pengguna tetap perlu mendaftar (Sign Up) dengan email yang sama agar dapat login ke dasbor pelanggan.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                  <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border-slate-300 rounded-xl px-4 py-2 text-slate-900 border focus:ring-brand-500 focus:border-brand-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full border-slate-300 rounded-xl px-4 py-2 text-slate-900 border focus:ring-brand-500 focus:border-brand-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Paket Internet</label>
                  <select value={formData.plan} onChange={(e) => setFormData({...formData, plan: e.target.value})} className="w-full border-slate-300 rounded-xl px-4 py-2 text-slate-900 border focus:ring-brand-500 focus:border-brand-500">
                    <option value="Paket Basic 20 Mbps">Paket Basic 20 Mbps</option>
                    <option value="Paket Pro 50 Mbps">Paket Pro 50 Mbps</option>
                    <option value="Paket Ultra 100 Mbps">Paket Ultra 100 Mbps</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full border-slate-300 rounded-xl px-4 py-2 text-slate-900 border focus:ring-brand-500 focus:border-brand-500">
                    <option value="active">Aktif</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">Batal</button>
                  <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 disabled:opacity-50">{isSubmitting ? 'Menyimpan...' : 'Simpan'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
