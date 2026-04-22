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
      if (event.origin !== window.location.origin && !event.origin.endsWith('.run.app') && !event.origin.includes('localhost')) {
        return;
      }
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        try {
          const redirectUri = `${window.location.origin}/api/auth/callback`;
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
      const redirectUri = `${window.location.origin}/api/auth/callback`;
      const response = await fetch(`/api/auth/google/url?redirectUri=${encodeURIComponent(redirectUri)}`);
      
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error(`Server error: ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get auth URL');
      }

      const authWindow = window.open(
        data.url,
        'oauth_popup',
        'width=600,height=700'
      );

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
    const payload = isRegister ? { email, password, displayName } : { email, password };
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error(`Server returned non-JSON: ${res.status} ${text.substring(0, 100)}`);
      }
      
      if (!res.ok) {
        setError(data.error || 'Authentication failed');
        return;
      }
      
      if (asAdmin && !data.user.isAdmin) {
        setError('You are not authorized to login as admin.');
        return;
      }
      
      // Pass token and user data back up
      localStorage.setItem('auth_token', data.token);
      onLoginSuccess(data.user.isAdmin ? 'admin' : 'home', data.token, data.user);
    } catch (err: any) {
      console.error("Auth error", err);
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
               className="w-full px-4 py-3 bg-brand-bg border border-brand-ink/20 rounded focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
               required
             />
          )}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-brand-bg border border-brand-ink/20 rounded focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-brand-bg border border-brand-ink/20 rounded focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
            required
          />
          
          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-brand-ink text-brand-bg py-4 rounded hover:bg-brand-ink/90 transition-colors font-medium"
            >
              <UserIcon className="w-5 h-5" />
              {isRegister ? 'Register' : 'Login'}
            </button>
          </div>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-brand-ink/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-brand-surface text-brand-ink/50 uppercase tracking-widest text-[10px]">or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 bg-brand-bg border border-brand-ink/20 text-brand-ink py-3 rounded hover:bg-brand-gold/10 hover:border-brand-gold transition-colors font-medium mb-4"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>

          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            className="w-full flex items-center justify-center gap-2 bg-transparent border border-brand-gold text-brand-gold py-4 rounded hover:bg-brand-gold hover:text-brand-bg transition-colors font-medium"
          >
            <ShieldCheck className="w-5 h-5" />
            Admin Login
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-brand-ink/80">
          {isRegister ? 'Already have an account? ' : "Don't have an account? "}
          <button 
            onClick={() => setIsRegister(!isRegister)} 
            className="text-brand-gold hover:underline font-medium"
          >
            {isRegister ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};
