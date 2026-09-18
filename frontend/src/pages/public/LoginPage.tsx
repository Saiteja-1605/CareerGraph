import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await login({ email, password });
      if (res.success) {
        if (from) {
          navigate(from, { replace: true });
        } else {
          const r = res.user.role;
          if (r === 'admin' || r === 'lecturer') {
            navigate('/admin', { replace: true });
          } else if (r === 'industry') {
            navigate('/admin/opportunities', { replace: true });
          } else {
            navigate('/dashboard', { replace: true });
          }
        }
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        (err.message === 'Network Error'
          ? 'Cannot connect to backend server. Please check your internet connection or verify the backend service status.'
          : err.message) ||
        'Failed to sign in. Please verify your credentials.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const setDemoCredentials = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-slate-900">CareerGraph</span>
        </Link>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Sign in to your account</h2>
        <p className="mt-1 text-sm text-slate-500">
          Or{' '}
          <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
            create a new student account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@college.edu"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Panel */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 text-center">
              Quick One-Click Demo Credentials
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDemoCredentials('admin@careergraph.dev', 'Admin@123456')}
                className="p-2 text-left rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-xs"
              >
                <div className="flex items-center gap-1 font-bold text-indigo-700">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </div>
                <div className="text-[11px] text-slate-500 truncate">Placement Director</div>
              </button>

              <button
                type="button"
                onClick={() => setDemoCredentials('rahul.sharma@college.edu', 'Student@123456')}
                className="p-2 text-left rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-xs"
              >
                <div className="flex items-center gap-1 font-bold text-emerald-700">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Rahul (82%)</span>
                </div>
                <div className="text-[11px] text-slate-500 truncate">Student Ready</div>
              </button>

              <button
                type="button"
                onClick={() => setDemoCredentials('faculty@college.edu', 'Faculty@123456')}
                className="p-2 text-left rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-xs"
              >
                <div className="flex items-center gap-1 font-bold text-purple-700">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Lecturer</span>
                </div>
                <div className="text-[11px] text-slate-500 truncate">Faculty Mentor</div>
              </button>

              <button
                type="button"
                onClick={() => setDemoCredentials('recruiter@techcorp.com', 'Industry@123456')}
                className="p-2 text-left rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-xs"
              >
                <div className="flex items-center gap-1 font-bold text-blue-700">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Industry</span>
                </div>
                <div className="text-[11px] text-slate-500 truncate">Campus Recruiter</div>
              </button>

              <button
                type="button"
                onClick={() => setDemoCredentials('alumni@college.edu', 'Alumni@123456')}
                className="p-2 text-left rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-xs"
              >
                <div className="flex items-center gap-1 font-bold text-teal-700">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Alumni</span>
                </div>
                <div className="text-[11px] text-slate-500 truncate">Microsoft SDE-2</div>
              </button>

              <button
                type="button"
                onClick={() => setDemoCredentials('priya.patel@college.edu', 'Student@123456')}
                className="p-2 text-left rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-xs"
              >
                <div className="flex items-center gap-1 font-bold text-sky-700">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Priya (58%)</span>
                </div>
                <div className="text-[11px] text-slate-500 truncate">Student Dev</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
