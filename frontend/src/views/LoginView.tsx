import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Mail, Lock, Eye, EyeOff, Loader2, CheckCircle2, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const LoginView: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-slate-50 overflow-hidden px-4">
      <main className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="mb-4 flex items-center justify-center w-16 h-16 bg-[#419CC3]/10 rounded-2xl shadow-sm text-[#419CC3]">
            <Building2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#419CC3] tracking-tight">TND SYSTEM</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola masa depan SDM Anda hari ini</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800">Masuk ke Akun</h2>
            <p className="text-sm text-slate-500">Gunakan kredensial resmi perusahaan Anda</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5" htmlFor="email">
                <Mail className="w-4 h-4 text-slate-400" />
                Email Karyawan
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@perusahaan.com"
                required
                className="h-11 rounded-lg border-slate-300 focus:border-[#419CC3] focus:ring focus:ring-[#419CC3]/20"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5" htmlFor="password">
                  <Lock className="w-4 h-4 text-slate-400" />
                  Kata Sandi
                </label>
                <a href="#" className="text-sm font-medium text-[#419CC3] hover:underline">
                  Lupa sandi?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-11 rounded-lg pr-10 border-slate-300 focus:border-[#419CC3] focus:ring focus:ring-[#419CC3]/20"
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

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#419CC3] focus:ring-[#419CC3]/20 cursor-pointer"
              />
              <label htmlFor="remember" className="text-sm font-medium text-slate-600 cursor-pointer select-none">
                Tetap masuk di perangkat ini
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-[#419CC3] hover:bg-[#3484a6] text-white font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  <span>Berhasil Masuk</span>
                </>
              ) : (
                <>
                  <span>Masuk</span>
                  <LogIn className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Social / SSO */}
          <div className="mt-8 text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-slate-400 font-semibold">Atau</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full h-11 border border-slate-300 rounded-lg font-bold text-sm text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-sm"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Masuk dengan SSO Perusahaan
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center space-y-4">
          <p className="text-sm font-medium text-slate-500">
            Belum punya akun?{' '}
            <a href="#" className="text-[#419CC3] font-bold hover:underline">
              Hubungi HRD
            </a>
          </p>
          <div className="flex justify-center gap-6 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-slate-600">Bantuan</a>
            <a href="#" className="hover:text-slate-600">Privasi</a>
            <a href="#" className="hover:text-slate-600">Syarat Layanan</a>
          </div>
        </footer>
      </main>
    </div>
  );
};
