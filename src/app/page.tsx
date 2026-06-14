import React from 'react';
import { 
  Wifi, 
  Zap, 
  Headset, 
  CheckCircle2, 
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      
      {/* Navbar (Optional but good for UX) */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
                <Wifi className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900">AntiGravity WiFi</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-slate-600 hover:text-brand-600 font-medium transition-colors">Fitur</a>
              <a href="#pricing" className="text-slate-600 hover:text-brand-600 font-medium transition-colors">Paket</a>
            </div>
            <div>
              <Link href="/login" className="text-brand-600 font-medium hover:text-brand-700 transition-colors mr-6 hidden sm:inline-block">
                Admin Login
              </Link>
              <Link 
                href="/login" 
                className="bg-brand-600 text-white px-5 py-2 rounded-full font-medium hover:bg-brand-700 transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                Login Pelanggan
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-brand-100/50 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-6">
            Internet Cepat, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-blue-400">Tanpa Batas.</span>
          </h1>
          <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Rasakan pengalaman berselancar internet yang stabil dengan kecepatan tinggi. 
            Didukung oleh teknologi fiber optik terkini untuk kebutuhan rumah dan bisnis Anda.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a 
              href="#pricing"
              className="group flex items-center justify-center gap-2 bg-brand-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 w-full sm:w-auto"
            >
              Cek Paket
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <Link 
              href="/login"
              className="flex items-center justify-center gap-2 bg-white text-brand-600 border border-brand-200 px-8 py-4 rounded-full font-semibold text-lg hover:bg-brand-50 transition-all w-full sm:w-auto"
            >
              Login Pelanggan
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Mengapa Memilih Kami?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">Keunggulan layanan WiFi yang dirancang khusus untuk kenyamanan Anda tanpa gangguan.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <div className="w-14 h-14 bg-brand-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7 text-brand-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Stabilitas Jaringan</h3>
              <p className="text-slate-600 leading-relaxed">
                Koneksi internet yang stabil 24/7 tanpa putus. Didesain untuk mendukung aktivitas bekerja tangga, streaming, dan gaming.
              </p>
            </div>
            
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Kecepatan Tinggi</h3>
              <p className="text-slate-600 leading-relaxed">
                Nikmati kecepatan simetris upload dan download hingga 100 Mbps dengan latensi sangat rendah.
              </p>
            </div>
            
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Headset className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Dukungan 24/7</h3>
              <p className="text-slate-600 leading-relaxed">
                Tim teknis kami selalu siap sedia membantu Anda kapanpun dibutuhkan melalui live chat atau telepon.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Pilih Paket Sesuai Kebutuhan</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">Harga transparan tanpa biaya tersembunyi. Bebas FUP, kuota unlimited selamanya.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            {/* 20 Mbps Plan */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:shadow-xl transition-shadow flex flex-col">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Paket Home 20Mbps</h3>
              <p className="text-slate-500 mb-6">Cocok untuk 1-3 perangkat aktif.</p>
              
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-slate-900">Rp 150.000</span>
                <span className="text-slate-500 font-medium">/bulan</span>
              </div>
              
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-slate-700">Kecepatan up to 20 Mbps</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-slate-700">100% Unlimited Quota (No FUP)</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-slate-700">Gratis Peminjaman Router</span>
                </li>
              </ul>
              
              <button className="w-full bg-brand-50 text-brand-700 font-bold py-4 rounded-xl hover:bg-brand-100 transition-colors">
                Pilih Paket
              </button>
            </div>

            {/* 50 Mbps Plan - Highlighted */}
            <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl shadow-brand-900/20 border border-brand-800 transform md:-translate-y-4 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                Paling Laris
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Paket Pro 50Mbps</h3>
              <p className="text-slate-400 mb-6">Ideal untuk keluarga & streaming 4K.</p>
              
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-white">Rp 250.000</span>
                <span className="text-slate-400 font-medium">/bulan</span>
              </div>
              
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-400 flex-shrink-0" />
                  <span className="text-slate-300">Kecepatan up to 50 Mbps</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-400 flex-shrink-0" />
                  <span className="text-slate-300">100% Unlimited Quota (No FUP)</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-400 flex-shrink-0" />
                  <span className="text-slate-300">Gratis Peminjaman Router Pro</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-400 flex-shrink-0" />
                  <span className="text-slate-300">Prioritas Dukungan Teknis</span>
                </li>
              </ul>
              
              <button className="w-full bg-brand-500 text-white font-bold py-4 rounded-xl hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/25">
                Pilih Paket
              </button>
            </div>

            {/* 100 Mbps Plan */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:shadow-xl transition-shadow flex flex-col lg:mt-0 md:col-span-2 lg:col-span-1 md:w-1/2 lg:w-full md:mx-auto">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Paket Ultra 100Mbps</h3>
              <p className="text-slate-500 mb-6">Performa maksimal untuk gamer.</p>
              
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-slate-900">Rp 400.000</span>
                <span className="text-slate-500 font-medium">/bulan</span>
              </div>
              
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-slate-700">Kecepatan up to 100 Mbps</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-slate-700">100% Unlimited Quota (No FUP)</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-slate-700">Gratis Peminjaman 2 Router Mesh</span>
                </li>
              </ul>
              
              <button className="w-full bg-brand-50 text-brand-700 font-bold py-4 rounded-xl hover:bg-brand-100 transition-colors">
                Pilih Paket
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-300 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Wifi className="w-6 h-6 text-brand-500" />
                <span className="font-bold text-xl text-white">AntiGravity WiFi</span>
              </div>
              <p className="text-slate-400 max-w-sm">
                Solusi internet cepat, stabil, dan terjangkau untuk memenuhi segala kebutuhan konektivitas Anda sehari-hari.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-white text-lg mb-4">Hubungi Kami</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                  <span>Jl. Teknologi No. 42, Cyber City, Jakarta Selatan 12345</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-slate-400 shrink-0" />
                  <span>+62 812 3456 7890</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-slate-400 shrink-0" />
                  <span>support@antigravity.project</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white text-lg mb-4">Tautan Singkat</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Portal Pelanggan</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} Project Antigravity. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
