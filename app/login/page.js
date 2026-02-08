"use client";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginInProgress, setLoginInProgress] = useState(false);
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [oauthStatus, setOauthStatus] = useState({
    google: false,
    github: false,
    configured: false,
    loading: true
  });
  const router = useRouter();

  useEffect(() => {
    // Check OAuth configuration status
    const checkOAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/oauth-status');
        const status = await response.json();
        setOauthStatus({ ...status, loading: false });
      } catch (error) {
        console.error('Failed to check OAuth status:', error);
        setOauthStatus(prev => ({ ...prev, loading: false }));
      }
    };

    checkOAuthStatus();
  }, []);

  async function handleLogin(ev) {
    ev.preventDefault();
    setError("");
    setLoginInProgress(true);

    try {
      // Check if input is email or username
      const isEmail = emailOrUsername.includes('@');
      const loginData = isEmail
        ? { email: emailOrUsername, password }
        : { username: emailOrUsername, password };

      const result = await signIn('credentials', {
        ...loginData,
        callbackUrl: '/dashboard',
        redirect: false
      });

      if (result?.error) {
        setError("Invalid credentials. Please check your email/username and password.");
      } else if (result?.ok) {
        // Show success toast
        toast.success("Login successful! Redirecting to your dashboard...", {
          duration: 2000,
          position: 'top-center',
          style: {
            background: '#10B981',
            color: '#ffffff',
            fontWeight: 'bold',
          },
        });

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      }
    } catch (error) {
      setError("Login failed. Please try again.");
      toast.error("Login failed. Please try again.");
    }

    setLoginInProgress(false);
  }

  const handleSocialAuth = async (provider) => {
    try {
      console.log(`Attempting ${provider} authentication for sign in...`);
      setError(''); // Clear any existing errors
      
      // For login page, we expect existing users or will create new ones
      const result = await signIn(provider, {
        callbackUrl: '/dashboard',
        redirect: true // Allow redirect for OAuth flow
      });

      console.log(`${provider} auth result:`, result);

      // If there's an error in the result, show it
      if (result?.error) {
        console.error(`${provider} authentication error:`, result.error);
        setError(`${provider} authentication failed: ${result.error}`);
        toast.error(`${provider} authentication failed. Please try again.`);
      }

    } catch (error) {
      console.error(`${provider} authentication error:`, error);
      setError(`${provider} authentication failed. Please try again.`);
      toast.error(`${provider} authentication failed. Please try again.`);
    }
  };

  const handleForgotPassword = async () => {
    if (!emailOrUsername) {
      setError("Please enter your email address first.");
      toast.error("Please enter your email address first.");
      return;
    }

    if (!emailOrUsername.includes('@')) {
      setError("Please enter your email address for password reset.");
      toast.error("Please enter your email address for password reset.");
      return;
    }

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailOrUsername }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Password reset instructions have been sent to your email address.", {
          duration: 4000,
          position: 'top-center',
        });
        setShowForgotPassword(false);
      } else {
        setError(data.error || "Failed to send password reset email.");
        toast.error(data.error || "Failed to send password reset email.");
      }
    } catch (error) {
      setError("Network error. Please try again.");
      toast.error("Network error. Please try again.");
    }
  };

  return (
    <section className="min-h-screen theme-bg flex flex-col justify-center items-center py-8 px-4">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <Link href='/' className='flex justify-center items-center mb-8 gap-4 animate-fade-in-down'>
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
            <img
              src='/logo.png'
              alt='upcode_logo'
              className='w-10 h-10 object-contain filter brightness-0 invert'
            />
          </div>
          <h1 className='font-black text-4xl theme-text'>
            UPCODE
          </h1>
        </Link>

        {/* Welcome Message */}
        <div className="text-center mb-8 animate-fade-in-up animation-delay-200">
          <h2 className="text-3xl font-bold theme-text mb-2">Welcome Back</h2>
          <p className="theme-text-secondary">Sign in to continue your coding journey</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-xl text-center backdrop-blur-sm" style={{ backgroundColor: 'var(--error-light)', border: '1px solid var(--error)', color: 'var(--error)' }}>
            {error}
          </div>
        )}

        {/* Login Form */}
        <form className="space-y-6 animate-fade-in-up animation-delay-300" onSubmit={handleLogin}>
          {/* Email or Username Field */}
          <div>
            <label className="block text-sm font-semibold theme-text mb-2">
              Email or Username
            </label>
            <input
              type="text"
              name="emailOrUsername"
              placeholder="Enter your email or username"
              value={emailOrUsername}
              disabled={loginInProgress}
              onChange={(ev) => setEmailOrUsername(ev.target.value)}
              className="w-full p-4 theme-surface backdrop-blur-sm border theme-border rounded-xl theme-text placeholder-gray-400 font-medium focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 hover:border-blue-400"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold theme-text">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm theme-accent hover:theme-text-secondary transition-colors duration-300"
              >
                Forgot password?
              </button>
            </div>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              disabled={loginInProgress}
              onChange={(ev) => setPassword(ev.target.value)}
              className="w-full p-4 theme-surface backdrop-blur-sm border theme-border rounded-xl theme-text placeholder-gray-400 font-medium focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 hover:border-blue-400"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loginInProgress}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-blue-500/50"
          >
            {loginInProgress ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing In...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-8">
          <div className="flex-1 border-t theme-border"></div>
          <span className="px-4 theme-text-secondary text-sm font-medium">Or continue with</span>
          <div className="flex-1 border-t theme-border"></div>
        </div>

        {/* Social Authentication */}
        <div className="space-y-3">
          <button
            onClick={() => handleSocialAuth('google')}
            className="w-full p-4 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            style={{ backgroundColor: 'var(--surface-base)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}
          >
            <img src="/google.png" alt="Google" className="w-5 h-5" />
            <span>Continue with Google</span>
          </button>

          <button
            onClick={() => handleSocialAuth('github')}
            className="w-full p-4 bg-[#24292f] hover:bg-[#32383f] text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
            </svg>
            <span>Continue with GitHub</span>
          </button>
        </div>

        {/* Register Link */}
        <div className="text-center mt-8">
          <p className="theme-text-secondary">
            Don't have an account?{' '}
            <Link href="/register" className="theme-accent hover:underline font-semibold transition-all duration-300">
              Create account here
            </Link>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="theme-surface border theme-border rounded-2xl p-8 max-w-md w-full shadow-2xl animate-scale-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold theme-text">Reset Password</h2>
              <button
                onClick={() => setShowForgotPassword(false)}
                className="theme-text-secondary hover:theme-text text-2xl transition-colors"
              >
                ×
              </button>
            </div>

            <p className="theme-text-secondary mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <div className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email address"
                value={emailOrUsername.includes('@') ? emailOrUsername : ''}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                className="w-full p-4 theme-surface border theme-border rounded-xl theme-text placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />

              <button
                onClick={handleForgotPassword}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-blue-500/50"
              >
                Send Reset Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast notifications */}
      <Toaster />
    </section>
  );
}