'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Mail, Loader2, AlertCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';

function LoginIllustration() {
  return (
    <svg viewBox="0 0 320 260" className="w-full max-w-[280px] mx-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Desk */}
      <rect x="30" y="190" width="230" height="10" rx="3" fill="#0258b8" />
      <rect x="45" y="200" width="8" height="35" fill="#023a80" />
      <rect x="235" y="200" width="8" height="35" fill="#023a80" />
      {/* Chair */}
      <rect x="70" y="150" width="45" height="10" rx="4" fill="#f59e0b" />
      <rect x="75" y="160" width="8" height="45" fill="#d97706" />
      <rect x="107" y="160" width="8" height="45" fill="#d97706" />
      {/* Laptop */}
      <rect x="140" y="160" width="70" height="45" rx="4" fill="#ffffff" stroke="#026dde" strokeWidth="3" />
      <rect x="147" y="167" width="56" height="31" rx="2" fill="#026dde" fillOpacity="0.12" />
      <rect x="130" y="184" width="90" height="8" rx="2" fill="#026dde" />
      {/* Person body */}
      <rect x="145" y="110" width="40" height="55" rx="14" fill="#026dde" />
      {/* Head */}
      <circle cx="165" cy="95" r="20" fill="#fbbf9a" />
      {/* Hair */}
      <path d="M145 90 Q145 72 165 72 Q185 72 185 90 Q178 82 165 82 Q152 82 145 90Z" fill="#3a2a1a" />
      {/* Arms */}
      <rect x="120" y="130" width="30" height="10" rx="5" fill="#fbbf9a" />
      <rect x="180" y="130" width="30" height="10" rx="5" fill="#fbbf9a" />
      {/* Speech bubble */}
      <rect x="205" y="55" width="60" height="34" rx="10" fill="#f59e0b" />
      <path d="M215 89 L215 100 L230 89 Z" fill="#f59e0b" />
      <circle cx="222" cy="72" r="3.5" fill="white" />
      <circle cx="235" cy="72" r="3.5" fill="white" />
      <circle cx="248" cy="72" r="3.5" fill="white" />
      {/* Floating dashboard card */}
      <rect x="20" y="30" width="70" height="48" rx="8" fill="white" fillOpacity="0.9" />
      <rect x="28" y="40" width="30" height="6" rx="3" fill="#026dde" />
      <rect x="28" y="52" width="54" height="4" rx="2" fill="#026dde" fillOpacity="0.3" />
      <rect x="28" y="60" width="40" height="4" rx="2" fill="#026dde" fillOpacity="0.3" />
      <rect x="28" y="68" width="46" height="4" rx="2" fill="#f59e0b" />
    </svg>
  );
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [initLoading, setInitLoading] = useState(true);

  // Fetch CSRF token on mount
  useEffect(() => {
    async function fetchCsrfToken() {
      try {
        const res = await fetch('/api/admin/auth');
        if (!res.ok) {
          setError('Failed to initialize login. Please refresh.');
          return;
        }
        const data = await res.json();
        setCsrfToken(data.csrfToken);
      } catch {
        setError('Failed to initialize login. Please refresh.');
      } finally {
        setInitLoading(false);
      }
    }
    fetchCsrfToken();
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError('');
      setLoading(true);

      try {
        const res = await fetch('/api/admin/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            csrfToken,
          }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          router.push('/admin');
          return;
        }

        // Handle errors
        if (res.status === 429) {
          setError('Too many login attempts. Please wait before trying again.');
        } else if (res.status === 401) {
          setError('Incorrect email or password. Please try again.');
        } else if (res.status === 403) {
          setError('Security validation failed. Please refresh the page and try again.');
        } else {
          setError(data.message || data.error || 'Login failed. Please try again.');
        }

        // Refresh CSRF token after failed attempt
        const csrfRes = await fetch('/api/admin/auth');
        if (csrfRes.ok) {
          const csrfData = await csrfRes.json();
          setCsrfToken(csrfData.csrfToken);
        }
      } catch {
        setError('Network error. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    },
    [email, password, csrfToken, router]
  );

  if (initLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f9ff]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Initializing secure login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f9ff] p-4">
      <div className="w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl grid md:grid-cols-2 bg-card">
        {/* Left panel — illustration */}
        <div className="hidden md:flex flex-col items-center justify-center gap-8 bg-brand-gradient p-10 text-center relative overflow-hidden">
          <div className="absolute top-10 -left-10 w-40 h-40 bg-card/10 rounded-full blur-2xl" />
          <div className="absolute bottom-10 -right-10 w-48 h-48 bg-[#f59e0b]/20 rounded-full blur-3xl" />
          <div className="relative z-10 flex items-center gap-2 text-white font-bold text-xl">
            <ShieldCheck className="size-6" />
            Chalo Admin
          </div>
          <div className="relative z-10">
            <LoginIllustration />
          </div>
          <p className="relative z-10 text-white/70 text-sm max-w-[240px]">
            Manage your school&apos;s content, leads, and platform — all from one secure dashboard.
          </p>
        </div>

        {/* Right panel — form */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-body">Login</h1>
          <p className="text-sm text-muted-foreground mt-1 mb-6">Sign in to access the admin dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="hidden" name="csrfToken" value={csrfToken} />

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                <AlertCircle className="size-4 mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="admin-email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                autoComplete="username"
                className="pl-10 h-11 rounded-full"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="pl-10 pr-10 h-11 rounded-full"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="size-4 text-muted-foreground" />
                ) : (
                  <Eye className="size-4 text-muted-foreground" />
                )}
              </Button>
            </div>

            <Button
              type="submit"
              disabled={loading || !email || !password || !csrfToken}
              className="w-full h-11 rounded-full bg-gradient-to-r from-[#026dde] to-[#00a3ff] hover:from-[#0258b8] hover:to-[#0288d1] font-semibold shadow-lg shadow-[#026dde]/20"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  Authenticating...
                </span>
              ) : (
                'Login'
              )}
            </Button>
          </form>

          <p className="text-xs text-center text-muted-foreground mt-6">
            This panel is protected. All access attempts are logged and rate-limited.
          </p>
        </div>
      </div>
    </div>
  );
}
