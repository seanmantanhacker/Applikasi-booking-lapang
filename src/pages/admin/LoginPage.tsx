// ============================================================
// JIOS — Admin Login Page
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, Loader2, AlertCircle } from 'lucide-react';
import JiosLogo from '../../components/JiosLogo';
import { signIn } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await signIn(email, password);
      navigate('/admin');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign in failed.';
      if (msg.includes('auth/wrong-password') || msg.includes('auth/user-not-found') || msg.includes('Invalid')) {
        setError('Invalid email or password. Please try again.');
      } else if (msg.includes('auth/too-many-requests')) {
        setError('Too many failed attempts. Please try again later.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const isMockMode = import.meta.env.VITE_USE_MOCK_DATA === 'true';

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #B9783F, transparent)', transform: 'translate(30%, -30%)' }}
        />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #F5F0E7, transparent)', transform: 'translate(-30%, 30%)' }}
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-4xl shadow-strong p-8 sm:p-10 animate-slide-up">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <JiosLogo variant="dark" size="lg" />
          </div>

          <h1 className="font-serif text-2xl text-navy text-center mb-1">Admin Login</h1>
          <p className="text-navy-300 text-sm text-center mb-8">
            Sign in to manage bookings and schedules.
          </p>

          {/* Demo mode hint */}
          {isMockMode && (
            <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-amber-800 text-xs text-center">
                <strong>Demo mode:</strong> Use <code>admin@jios.com</code> / <code>jios2024</code>
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="admin-email" className="form-label">Email Address</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Mail className="w-4 h-4 text-navy-300" />
                </div>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null); }}
                  placeholder="admin@jios.com"
                  className="form-input pl-10"
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="admin-password" className="form-label">Password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Lock className="w-4 h-4 text-navy-300" />
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  placeholder="••••••••"
                  className="form-input pl-10 pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-300 hover:text-navy transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full btn-lg"
              id="admin-login-btn"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-cream-500 text-xs mt-6">
          Admin access only. Not a booking page.
        </p>
      </div>
    </div>
  );
}
