"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Wifi, 
  LayoutDashboard, 
  Users, 
  FileText, 
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase/config';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, userData, loading } = useAuth();

  React.useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (userData && userData.role !== 'admin') {
        router.push('/dashboard');
      }
    }
  }, [user, userData, loading, router]);

  if (loading || !user || userData?.role !== 'admin') {
    return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">Memuat...</div>;
  }

  const navItems = [
    { name: 'Dashboard Admin', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Manajemen Pelanggan', href: '/admin/customers', icon: Users },
    { name: 'Manajemen Tagihan', href: '/admin/invoices', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex fixed h-full z-10 text-slate-300">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <Wifi className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white">AntiGravity</span>
          </div>
        </div>

        <div className="p-4 flex-1">
          <div className="mb-6 px-4 py-3 bg-slate-800 rounded-xl flex items-center gap-3 border border-slate-700">
            <div className="w-10 h-10 bg-brand-900 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Administrator</p>
              <p className="text-xs text-brand-400">System Admin</p>
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
                      ? 'bg-brand-600 text-white font-semibold shadow-lg shadow-brand-500/20' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => auth.signOut()}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-red-900/30 hover:text-red-400 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center px-4 md:hidden sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <Wifi className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white">AntiGravity Admin</span>
          </div>
        </header>

        <div className="p-4 md:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
