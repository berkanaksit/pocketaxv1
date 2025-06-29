import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Shield, Key } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { isTestingBypassEnabled, validateBypassCode } from '../lib/testing';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [bypassCode, setBypassCode] = useState('');
  const [bypassLoading, setBypassLoading] = useState(false);
  const navigate = useNavigate();

  const bypassEnabled = isTestingBypassEnabled();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setDebugInfo('');

    try {
      // Basic validation
      if (!email || !email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      if (!password || password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      setDebugInfo('Attempting to sign in...');
      
      // Clear any existing session first
      await supabase.auth.signOut();
      
      setDebugInfo('Signing in with credentials...');

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      setDebugInfo(`Sign in response: ${JSON.stringify({ 
        hasUser: !!data?.user, 
        hasSession: !!data?.session,
        error: signInError?.message 
      })}`);

      if (signInError) {
        console.error('Sign in error:', signInError);
        throw new Error(signInError.message);
      }

      if (!data?.user) {
        throw new Error('No user returned from authentication');
      }

      if (!data?.session) {
        throw new Error('No session created');
      }

      setDebugInfo('Login successful, redirecting...');
      toast.success('Welcome back!');
      
      // Small delay to ensure session is properly set
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 100);

    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = 'Failed to sign in';
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Please check your email and click the confirmation link';
      } else if (error.message.includes('rate')) {
        errorMessage = 'Too many attempts. Please wait a moment and try again';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      setDebugInfo(`Error: ${error.message}`);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBypass = async () => {
    if (!bypassCode.trim()) {
      toast.error('Please enter a bypass code');
      return;
    }

    setBypassLoading(true);
    
    try {
      if (validateBypassCode(bypassCode.trim())) {
        toast.success('Bypass activated! Redirecting to dashboard...');
        console.log('[BYPASS] Development bypass used');
        
        // Navigate directly to dashboard
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 500);
      } else {
        toast.error('Invalid bypass code');
        setBypassCode('');
      }
    } catch (error) {
      toast.error('Bypass failed');
      console.error('[BYPASS] Error:', error);
    } finally {
      setBypassLoading(false);
    }
  };
  const handlePasswordReset = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter your email address first');
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error: any) {
      console.error('Password reset error:', error);
      if (error.message.includes('rate')) {
        toast.error('Please wait before requesting another password reset');
      } else {
        toast.error('Failed to send password reset email');
      }
    }
  };

  const testConnection = async () => {
    try {
      setDebugInfo('Testing Supabase connection...');
      const { data, error } = await supabase.auth.getSession();
      setDebugInfo(`Connection test: ${JSON.stringify({ 
        hasSession: !!data?.session,
        error: error?.message 
      })}`);
    } catch (error: any) {
      setDebugInfo(`Connection error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-200 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex items-center text-sm font-medium text-neutral-800 hover:text-primary-600 mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </Link>
        <h2 className="text-center text-3xl font-heading font-bold text-neutral-800">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-800">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
            Sign up
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Development Bypass Warning */}
        {bypassEnabled && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <Shield className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-800 font-medium">Development Mode</p>
                <p className="text-xs text-yellow-700 mt-1">
                  Login bypass is active for testing purposes only
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {debugInfo && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                <p className="text-xs text-blue-700 font-mono">{debugInfo}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-800">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-800">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-800">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  onClick={handlePasswordReset}
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Forgot your password?
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={testConnection}
                className="w-full text-xs text-gray-500 hover:text-gray-700"
              >
                Test Connection
              </button>
            </div>
          </form>

          {/* Development Bypass Section */}
          {bypassEnabled && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center mb-3">
                  <Key className="h-5 w-5 text-orange-600 mr-2" />
                  <h3 className="text-sm font-medium text-orange-800">Development Bypass</h3>
                </div>
                <p className="text-xs text-orange-700 mb-3">
                  Skip login for development and testing purposes
                </p>
                <div className="space-y-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Enter bypass code"
                      value={bypassCode}
                      onChange={(e) => setBypassCode(e.target.value)}
                      className="block w-full px-3 py-2 border border-orange-300 rounded-md shadow-sm placeholder-orange-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                      onKeyPress={(e) => e.key === 'Enter' && handleBypass()}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleBypass}
                    disabled={bypassLoading || !bypassCode.trim()}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {bypassLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Activating...
                      </div>
                    ) : (
                      'Bypass Login'
                    )}
                  </button>
                  <p className="text-xs text-orange-600 text-center">
                    ⚠️ This bypass will be automatically disabled in production
                  </p>
                </div>
              </div>
            </div>
          )}
          {/* Quick test credentials for development */}
          <div className={`${bypassEnabled ? 'mt-4' : 'mt-6'} pt-6 border-t border-gray-200`}>
            <p className="text-xs text-gray-500 text-center">
              {bypassEnabled 
                ? 'Use bypass code: DEV_BYPASS_2026' 
                : 'For testing, try creating a new account first or check console for debug info'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;