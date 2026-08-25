import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, LogIn, AlertCircle, CheckCircle, Zap, Shield, BarChart3, Smartphone } from 'lucide-react';
import { getRefreshToken, getCachedUser } from '../services/authService';

export const Login: React.FC = () => {
  const { theme } = useTheme();
  const { login, isAuthenticated, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const state = location.state as { message?: string } | null;
    if (state?.message) {
      setSuccessMessage(state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    if (isAuthenticated && !isLoading) navigate('/system/dashboard', { replace: true });
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => { return () => clearError(); }, [clearError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) clearError();
    if (successMessage) setSuccessMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(null);
    try {
      await login(formData);
      navigate('/system/dashboard', { replace: true });
    } catch { /* handled by context */ } finally {
      setIsSubmitting(false);
    }
  };

  const hasPossibleSession = !!getRefreshToken() || !!getCachedUser();
  if (isLoading && hasPossibleSession) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <div className="text-center">
          <div className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`}>
            <svg className="animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>Checking session...</p>
        </div>
      </div>
    );
  }

  const features = [
    { icon: Zap, title: 'Fast POS Billing', desc: 'Process customer sales, print receipts, and issue invoices instantly.' },
    { icon: Shield, title: 'Real-time Inventory', desc: 'Live stock tracking, serial numbers, and GRN procurement.' },
    { icon: BarChart3, title: 'Financial Reports', desc: 'Track daily cash flow, expenses, profit margins, and sales analytics.' },
    { icon: Smartphone, title: 'Service & Repairs', desc: 'Manage job notes, warranties, and technician status.' },
  ];

  return (
    <div
      className={`min-h-screen flex ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}
      style={{
        '--accent-50': '239 246 255',
        '--accent-100': '219 234 254',
        '--accent-200': '191 219 254',
        '--accent-300': '147 197 253',
        '--accent-400': '96 165 250',
        '--accent-500': '59 130 246',
        '--accent-600': '37 99 235',
        '--accent-700': '29 78 216',
        '--accent-800': '30 64 175',
        '--accent-900': '30 58 138',
        '--accent-950': '23 37 84',
        '--accent2-50': '236 254 255',
        '--accent2-100': '207 250 254',
        '--accent2-200': '165 243 252',
        '--accent2-300': '103 232 249',
        '--accent2-400': '34 211 238',
        '--accent2-500': '6 182 212',
        '--accent2-600': '8 145 178',
        '--accent2-700': '14 116 144',
        '--accent2-800': '21 94 117',
        '--accent2-900': '22 78 99',
        '--accent2-950': '8 51 68',
      } as React.CSSProperties}
    >

      {/* ─── Left Panel: Illustration / Branding (hidden on mobile) ─── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden">
        {/* Background image with fallback gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500" />
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/50 to-cyan-900/60" />

        {/* Accent glow effects */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-32 right-16 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-blue-400/15 rounded-full blur-2xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between w-full p-12 xl:p-16">
          {/* Top: Logo */}
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Microvision Computers" className="w-12 h-12 rounded-xl shadow-lg" />
            <div>
              <h2 className="text-2xl font-bold text-white">Microvision Computers</h2>
              <p className="text-blue-100 text-sm">Internal Management Portal</p>
            </div>
          </div>

          {/* Center: Hero text + features */}
          <div className="space-y-10">
            <div>
              <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight">
                Welcome to <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-200">
                  Microvision Portal
                </span>
              </h1>
              <p className="mt-4 text-lg text-blue-100 max-w-md leading-relaxed">
                Authorized staff portal for sales, billing, inventory tracking, and shop management.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {features.map((f) => (
                <div key={f.title} className="group p-4 rounded-2xl bg-white/[0.07] backdrop-blur-md border border-white/[0.12] hover:bg-white/[0.12] hover:border-blue-400/30 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-500">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400/25 to-cyan-400/25 border border-white/10 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-400/20 transition-all duration-300">
                    <f.icon className="w-5 h-5 text-blue-300" />
                  </div>
                  <h3 className="font-semibold text-white text-sm">{f.title}</h3>
                  <p className="text-slate-300/80 text-xs mt-1 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom: Removed multi-tenant trust badge */}
          <div />
        </div>
      </div>

      {/* ─── Right Panel: Login Form ─── */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12 relative overflow-hidden">
        {/* Decorative accent blurs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-0 w-64 h-64 bg-blue-500/[0.05] rounded-full blur-3xl hidden lg:block" />
        </div>

        <div className="relative w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-3 mb-8 lg:hidden">
            <img src='logo.png' alt="Microvision Computers" className="w-12 h-12 rounded-xl shadow-lg" />
            <div>
              <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Microvision Computers</h2>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Internal Management Portal</p>
            </div>
          </div>

          {/* Card */}
          <div className={`p-6 sm:p-8 rounded-2xl sm:rounded-3xl border shadow-2xl transition-colors ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-slate-800/90 via-blue-950/40 to-slate-900/90 border-blue-500/15 backdrop-blur-xl shadow-blue-500/5'
              : 'bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/20 border-blue-200/50 shadow-blue-500/10'
          }`}>
            {/* Header */}
            <div className="mb-7">
              <h1 className={`text-2xl sm:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Welcome back
              </h1>
              <p className={`mt-2 text-sm sm:text-base ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Sign in to continue to your dashboard
              </p>
            </div>

            {/* Success message */}
            {successMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-blue-500 shrink-0" />
                <p className={`text-sm ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{successMessage}</p>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className={`mb-5 p-3.5 rounded-xl flex items-center gap-3 ${
                error.includes('starting up')
                  ? 'bg-amber-500/10 border border-amber-500/20'
                  : 'bg-red-500/10 border border-red-500/20'
              }`}>
                <AlertCircle className={`w-5 h-5 shrink-0 ${error.includes('starting up') ? 'text-amber-400' : 'text-red-400'}`} />
                <p className={`text-sm ${error.includes('starting up') ? 'text-amber-400' : 'text-red-400'}`}>{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm transition-all ${
                      theme === 'dark'
                        ? 'bg-slate-800/60 border-slate-700/60 text-white placeholder-slate-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white'
                    }`}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  Password
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className={`w-full pl-11 pr-12 py-3 rounded-xl border text-sm transition-all ${
                      theme === 'dark'
                        ? 'bg-slate-800/60 border-slate-700/60 text-white placeholder-slate-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${
                      theme === 'dark' ? 'text-slate-500 hover:text-slate-300 hover:bg-slate-700/50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Forgot */}
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className={`text-sm font-medium transition-colors ${
                    theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                  }`}
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-xl font-semibold text-white text-sm transition-all flex items-center justify-center gap-2 ${
                  isSubmitting
                    ? 'bg-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.01] active:scale-[0.99]'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Registration links removed — single shop / internal enterprise mode */}
          </div>

          {/* Footer */}
          <p className={`mt-6 text-center text-xs ${theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}`}>
            © 2026 Microvision Computers. Powered by NebulaInfinite.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;