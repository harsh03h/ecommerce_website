import React, { useState } from 'react';
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
      
      // Pass token and user data back up
      localStorage.setItem('auth_token', data.token);
      onLoginSuccess(asAdmin ? 'admin' : 'home', data.token, data.user);
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
               className="w-full px-4 py-3 bg-white border border-brand-ink/20 rounded focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
               required
             />
          )}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-brand-ink/20 rounded focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-brand-ink/20 rounded focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
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
              <span className="px-2 bg-brand-surface text-brand-ink/50 uppercase tracking-widest text-[10px]">or</span>
            </div>
          </div>

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
