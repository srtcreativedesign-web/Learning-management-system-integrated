import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Mail, Lock, Eye, EyeOff, Loader2, CheckCircle2, LogIn, ShieldCheck } from 'lucide-react';
import logoTnd from '@/assets/logo tnd.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';

export const LoginView: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login(email, password);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setIsSubmitting(true);
    await login(demoEmail, 'password123');
    setIsSuccess(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 500);
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-slate-50 overflow-hidden px-4 py-8">
      <main className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="mb-3 flex items-center justify-center w-16 h-16 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
            <img src={logoTnd} alt="TND Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#419CC3] tracking-tight">TND SYSTEM</h1>
          <p className="text-xs text-slate-500 mt-0.5">Sistem Terintegrasi LMS, In-House Training & Audit</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl p-7 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-800">Masuk ke Web Admin</h2>
            <p className="text-xs text-slate-500">Pilih role atau masukkan email resmi perusahaan</p>
          </div>

          {/* Quick RBAC Role Selectors */}
          <div className="mb-5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#419CC3]" /> Masuk Cepat Berdasarkan Role:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@sobathr.com')}
                className="p-2 bg-white border border-purple-200 hover:border-purple-400 hover:bg-purple-50/40 rounded-lg text-left transition-all"
              >
                <span className="font-bold text-xs text-purple-700 block">👑 Super Admin</span>
                <span className="text-[10px] text-slate-400">Unlock Semua Fitur</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('manager.hrbp@sobathr.com')}
                className="p-2 bg-white border border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50/40 rounded-lg text-left transition-all"
              >
                <span className="font-bold text-xs text-indigo-700 block">💼 Manager HRBP</span>
                <span className="text-[10px] text-slate-400">Semua Fitur + Global</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('budi.trainer@sobathr.com')}
                className="p-2 bg-white border border-[#419CC3]/30 hover:border-[#419CC3] hover:bg-[#419CC3]/5 rounded-lg text-left transition-all"
              >
                <span className="font-bold text-xs text-[#419CC3] block">🎓 Trainer</span>
                <span className="text-[10px] text-slate-400">Kursus & In-House</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('dian.auditor@sobathr.com')}
                className="p-2 bg-white border border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/40 rounded-lg text-left transition-all"
              >
                <span className="font-bold text-xs text-emerald-700 block">🔍 Auditor</span>
                <span className="text-[10px] text-slate-400">Audit & Outlet Saja</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5" htmlFor="email">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Email Karyawan
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@sobathr.com"
                required
                className="h-10 text-xs rounded-lg border-slate-300 focus:border-[#419CC3]"
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5" htmlFor="password">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  Kata Sandi
                </label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-10 text-xs rounded-lg pr-10 border-slate-300 focus:border-[#419CC3]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#419CC3] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 bg-[#419CC3] hover:bg-[#3484a6] text-white font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 text-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Berhasil Masuk</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dasbor</span>
                  <LogIn className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

