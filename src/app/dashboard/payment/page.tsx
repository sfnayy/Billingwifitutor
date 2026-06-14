"use client";

import React, { useState, useEffect } from 'react';
import { CreditCard, Wallet, Building2, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { collection, query, where, getDocs, updateDoc, doc, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function PaymentPage() {
  const router = useRouter();
  const { userData } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState<string>('va');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInvoice() {
      if (!userData?.uid) return;
      try {
        const q = query(
          collection(db, 'invoices'),
          where('userId', '==', userData.uid),
          where('status', '==', 'unpaid'),
          limit(1)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setInvoice({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
        }
      } catch (err) {
        console.error("Error fetching invoice", err);
      } finally {
        setLoading(false);
      }
    }
    fetchInvoice();
  }, [userData]);

  const handlePayment = async () => {
    if (!invoice) return;
    setIsProcessing(true);
    
    try {
      await updateDoc(doc(db, 'invoices', invoice.id), {
        status: 'paid',
        paidAt: new Date().toISOString(),
        paymentMethod: selectedMethod
      });
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      alert('Gagal memproses pembayaran');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-brand-600" /></div>;
  }

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center mt-10">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Pembayaran Berhasil!</h2>
        <p className="text-slate-500 mb-8">Terima kasih, tagihan internet Anda untuk bulan ini telah dilunasi.</p>
        
        <div className="bg-slate-50 rounded-xl p-6 mb-8 text-left border border-slate-100">
          <div className="flex justify-between mb-3">
            <span className="text-slate-500">ID Referensi</span>
            <span className="font-semibold text-slate-900">REF-{Math.floor(Math.random() * 1000000)}</span>
          </div>
          <div className="flex justify-between mb-3">
            <span className="text-slate-500">Jumlah Dibayar</span>
            <span className="font-semibold text-slate-900">Rp {invoice.amount?.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Metode</span>
            <span className="font-semibold text-slate-900 uppercase">{selectedMethod}</span>
          </div>
        </div>

        <Link href="/dashboard/billing" className="inline-flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-700 transition-colors">
          Lihat Riwayat Tagihan <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="max-w-2xl mx-auto mt-10 text-center">
        <h2 className="text-xl font-bold text-slate-900">Tidak Ada Tagihan</h2>
        <p className="text-slate-500 mt-2 mb-6">Anda tidak memiliki tagihan yang perlu dibayar saat ini.</p>
        <button onClick={() => router.push('/dashboard')} className="px-4 py-2 bg-slate-100 rounded-lg">Kembali ke Dashboard</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Selesaikan Pembayaran</h1>
      <p className="text-slate-500 mb-8">Pilih metode pembayaran yang Anda inginkan.</p>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Payment Methods */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Pilih Metode Pembayaran</h3>
            
            <div className="space-y-3">
              <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${selectedMethod === 'va' ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500' : 'border-slate-200 hover:border-brand-300'}`}>
                <input type="radio" name="payment_method" value="va" checked={selectedMethod === 'va'} onChange={(e) => setSelectedMethod(e.target.value)} className="w-4 h-4 text-brand-600 border-slate-300 focus:ring-brand-500" />
                <div className="ml-4 flex-1">
                  <span className="block text-sm font-semibold text-slate-900">Virtual Account (Bank Transfer)</span>
                  <span className="block text-sm text-slate-500">BCA, Mandiri, BNI, BRI</span>
                </div>
              </label>

              <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${selectedMethod === 'ewallet' ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500' : 'border-slate-200 hover:border-brand-300'}`}>
                <input type="radio" name="payment_method" value="ewallet" checked={selectedMethod === 'ewallet'} onChange={(e) => setSelectedMethod(e.target.value)} className="w-4 h-4 text-brand-600 border-slate-300 focus:ring-brand-500" />
                <div className="ml-4 flex-1">
                  <span className="block text-sm font-semibold text-slate-900">E-Wallet</span>
                  <span className="block text-sm text-slate-500">GoPay, OVO, Dana, ShopeePay</span>
                </div>
              </label>

              <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${selectedMethod === 'cc' ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500' : 'border-slate-200 hover:border-brand-300'}`}>
                <input type="radio" name="payment_method" value="cc" checked={selectedMethod === 'cc'} onChange={(e) => setSelectedMethod(e.target.value)} className="w-4 h-4 text-brand-600 border-slate-300 focus:ring-brand-500" />
                <div className="ml-4 flex-1">
                  <span className="block text-sm font-semibold text-slate-900">Kartu Kredit / Debit</span>
                  <span className="block text-sm text-slate-500">Visa, Mastercard, JCB</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-8">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Ringkasan Pembayaran</h3>
            
            <div className="space-y-3 mb-6 pb-6 border-b border-slate-100 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Paket Internet</span>
                <span className="font-medium text-slate-900">{userData?.plan || 'Langganan WiFi'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tagihan Bulan</span>
                <span className="font-medium text-slate-900">{invoice.billingMonth?.toDate ? invoice.billingMonth.toDate().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : 'Bulan Ini'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Biaya Layanan</span>
                <span className="font-medium text-slate-900">Rp 0</span>
              </div>
            </div>

            <div className="flex justify-between mb-8">
              <span className="text-base font-bold text-slate-900">Total Tagihan</span>
              <span className="text-xl font-extrabold text-brand-600">Rp {invoice.amount?.toLocaleString('id-ID')}</span>
            </div>

            <button 
              onClick={handlePayment} 
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 bg-brand-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-brand-700 transition-all shadow-sm shadow-brand-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>Memproses... <Loader2 className="w-5 h-5 animate-spin" /></>
              ) : (
                <>Bayar Sekarang <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
            <p className="text-xs text-center text-slate-400 mt-4">Transaksi ini diamankan dengan enkripsi 256-bit.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
