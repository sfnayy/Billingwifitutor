"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Wifi, Lock, Mail, ArrowRight, User } from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Save user details to Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name,
        email,
        role: 'customer',
        plan: 'Paket Basic 20 Mbps',
        status: 'active',
        createdAt: new Date().toISOString()
      });

      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email sudah digunakan, silakan gunakan email lain atau login.');
      } else {
        setError('Terjadi kesalahan saat pendaftaran.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center gap-2 mb-6">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30">
            <Wifi className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-2xl text-slate-900">AntiGravity WiFi</span>
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900">
          Buat Akun Baru
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Daftar sekarang untuk mulai berlangganan
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleRegister}>
            
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Nama Lengkap
              </label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl text-slate-900 bg-white focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-colors"
                  placeholder="Nama Lengkap Anda"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Alamat Email
              </label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl text-slate-900 bg-white focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-colors"
                  placeholder="anda@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl text-slate-900 bg-white focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-colors"
                  placeholder="Minimal 6 karakter"
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Memproses...' : 'Daftar Sekarang'}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Sudah punya akun?{' '}
                <a href="/login" className="font-bold text-brand-600 hover:text-brand-500 transition-colors">
                  Masuk di sini
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
