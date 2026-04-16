import React from 'react';
import { signInWithGoogle } from '../firebase';
import { UserIcon, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (view: 'home' | 'admin') => void;
}

export const Login = ({ onLoginSuccess }: LoginProps) => {
  const handleUserLogin = async () => {
    try {
      await signInWithGoogle();
      onLoginSuccess('home');
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleAdminLogin = async () => {
    try {
      await signInWithGoogle();
      onLoginSuccess('admin');
    } catch (error) {
      console.error("Admin login failed", error);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-brand-surface p-8 rounded-xl border border-brand-ink/10 shadow-sm">
        <h2 className="text-3xl font-serif text-center text-brand-ink mb-8">Welcome Back</h2>
        
        <div className="space-y-6">
          <button
            onClick={handleUserLogin}
            className="w-full flex items-center justify-center gap-3 bg-brand-ink text-brand-bg py-4 rounded-lg hover:bg-brand-ink/90 transition-colors font-medium"
          >
            <UserIcon className="w-5 h-5" />
            Continue as User
          </button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-brand-ink/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-brand-surface text-brand-ink/50 uppercase tracking-widest text-[10px]">or</span>
            </div>
          </div>

          <button
            onClick={handleAdminLogin}
            className="w-full flex items-center justify-center gap-3 bg-transparent border-2 border-brand-gold text-brand-gold py-4 rounded-lg hover:bg-brand-gold hover:text-brand-bg transition-colors font-medium"
          >
            <ShieldCheck className="w-5 h-5" />
            Admin Login
          </button>
        </div>
        
        <p className="mt-8 text-center text-xs text-brand-ink/60 leading-relaxed">
          By continuing, you agree to our Terms of Service and Privacy Policy. Admin access requires authorized credentials.
        </p>
      </div>
    </div>
  );
};
