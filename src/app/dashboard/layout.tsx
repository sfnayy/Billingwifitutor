"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Wifi, 
  Home, 
  Receipt, 
  CreditCard, 
  LogOut,
  User
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase/config';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, userData, loading } = useAuth();

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">Memuat...</div>;
  }

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Riwayat Tagihan', href: '/dashboard/billing', icon: Receipt },
    { name: 'Pembayaran', href: '/dashboard/payment', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex fixed h-full z-10">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <Wifi className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900">AntiGravity</span>
          </div>
        </div>

        <div className="p-4 flex-1">
          <div className="mb-6 px-4 py-3 bg-slate-50 rounded-xl flex items-center gap-3 border border-slate-100">
            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-slate-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{userData?.name || 'Customer'}</p>
              <p className="text-xs text-slate-500">{userData?.email}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive 
                      ? 'bg-brand-50 text-brand-700 font-semibold' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-200">
          <button
            onClick={() => auth.signOut()}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 md:hidden sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <Wifi className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900">AntiGravity</span>
          </div>
        </header>

        <div className="p-4 md:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
