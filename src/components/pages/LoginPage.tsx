import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth-store';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const signIn = useAuthStore((s) => s.signIn);
  const signUp = useAuthStore((s) => s.signUp);
  const signInWithGoogle = useAuthStore((s) => s.signInWithGoogle);

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
        setSignUpSuccess(true);
      } else {
        await signIn(email, password);
        navigate('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed');
    }
  };

  if (signUpSuccess) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-surface-elevated border border-border rounded-lg p-8 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-success/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">Check Your Email</h2>
          <p className="text-sm text-text-secondary mb-6">
            We sent a confirmation link to <span className="text-text-primary font-medium">{email}</span>.
            Click it to activate your account.
          </p>
          <button
            onClick={() => { setIsSignUp(false); setSignUpSuccess(false); }}
            className="text-sm text-accent hover:text-accent-light transition-colors"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* EGX Branding */}
        <div className="text-center mb-8">
          <span className="text-3xl font-extrabold tracking-widest bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
            EGX
          </span>
          <p className="text-sm text-text-secondary mt-1">Sign Designer</p>
        </div>

        {/* Form card */}
        <div className="bg-surface-elevated border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-1">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-text-muted mb-6">
            {isSignUp
              ? 'Sign up to save and share your sign packages.'
              : 'Sign in to access your saved designs.'}
          </p>

          {error && (
            <div className="mb-4 p-3 rounded bg-error/10 border border-error/30 text-error text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label className="block text-[11px] text-text-label mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm bg-white/5 border border-border rounded text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none transition-colors"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label className="block text-[11px] text-text-label mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-3 py-2 text-sm bg-white/5 border border-border rounded text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none transition-colors"
                placeholder="Min 6 characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full py-2.5 text-sm font-medium rounded bg-gradient-to-r from-accent to-accent-light text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? 'Please wait...'
                : isSignUp
                  ? 'Create Account'
                  : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] text-text-muted uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Google */}
          <button
            onClick={handleGoogle}
            className="w-full py-2.5 text-sm font-medium rounded border border-border text-text-secondary hover:border-accent hover:text-accent transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </button>

          {/* Toggle sign up / sign in */}
          <p className="text-center text-xs text-text-muted mt-5">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
              className="text-accent hover:text-accent-light transition-colors font-medium"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-text-muted mt-6">
          Powered by EGX Group — Make Your Projects One Trade Lighter
        </p>
      </div>
    </div>
  );
};
