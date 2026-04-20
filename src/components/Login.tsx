import React, { useState, useEffect } from 'react';
import { UserIcon, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (view: 'home' | 'admin', token: string, user: any) => void;
}

export const Login = ({ onLoginSuccess }: LoginProps) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (!event.origin.endsWith('.run.app') && !event.origin.includes('localhost')) {
        return;
      }
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        try {
          const redirectUri = `${window.location.origin}/auth/callback`;
          const res = await fetch('/api/auth/google/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: event.data.code, redirectUri })
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.error);

          localStorage.setItem('auth_token', data.token);
          onLoginSuccess(data.user.isAdmin ? 'admin' : 'home', data.token, data.user);

        } catch (err: any) {
          setError("Google login failed: " + err.message);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onLoginSuccess]);

  const handleGoogleLogin = async () => {
    try {
      const redirectUri = `${window.location.origin}/auth/callback`;

      const res = await fetch(`/api/auth/google/url?redirectUri=${encodeURIComponent(redirectUri)}`);

      let data: any;

      try {
        data = await res.json();
      } catch {
        const text = await res.text();
        console.error("RAW RESPONSE:", text);
        throw new Error("Invalid response from server");
      }

      if (!res.ok) {
        throw new Error(data.error || 'Failed to get auth URL');
      }

      const authWindow = window.open(data.url, 'oauth_popup', 'width=600,height=700');

      if (!authWindow) {
        setError('Please allow popups for this site to connect your account.');
      }

    } catch (error: any) {
      console.error('OAuth error:', error);
      setError(error.message || 'Failed to start Google Login');
    }
  };

  const handleSubmit = async (e: React.FormEvent, asAdmin: boolean = false) => {
    e.preventDefault();
    setError('');

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegister
      ? { email, password, displayName }
      : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let data: any;

      try {
        data = await res.json(); // ✅ FIXED
      } catch {
        const text = await res.text();
        console.error("RAW RESPONSE:", text);
        throw new Error("Server returned invalid JSON");
      }

      if (!res.ok) {
        setError(data?.error || 'Authentication failed');
        return;
      }

      if (asAdmin && !data.user?.isAdmin) {
        setError('You are not authorized to login as admin.');
        return;
      }

      localStorage.setItem('auth_token', data.token);
      onLoginSuccess(
        data.user.isAdmin ? 'admin' : 'home',
        data.token,
        data.user
      );

    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err.message || "Failed to authenticate. Please check connection.");
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-brand-surface p-8 rounded-xl border border-brand-ink/10 shadow-sm">
        <h2 className="text-3xl font-serif text-center text-brand-ink mb-8">
          {isRegister ? 'Create Account' : 'Welcome Back'}
        </h2>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form className="space-y-4" onSubmit={(e) => handleSubmit(e, false)}>
          {isRegister && (
            <input
              type="text"
              placeholder="Full Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 border rounded"
              required
            />
          )}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border rounded"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded"
            required
          />

          <button type="submit" className="w-full py-3 bg-black text-white rounded">
            <UserIcon className="inline mr-2" />
            {isRegister ? 'Register' : 'Login'}
          </button>

          <button type="button" onClick={handleGoogleLogin} className="w-full py-3 border rounded mt-2">
            Google
          </button>

          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            className="w-full py-3 border rounded mt-2"
          >
            <ShieldCheck className="inline mr-2" />
            Admin Login
          </button>
        </form>
      </div>
    </div>
  );
};
