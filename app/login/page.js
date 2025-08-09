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
      const result = await signIn(provider, {
        callbackUrl: '/dashboard',
        redirect: false
      });

      if (result?.ok) {
        toast.success(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login successful! Redirecting...`, {
          duration: 2000,
          position: 'top-center',
          style: {
            background: '#10B981',
            color: '#ffffff',
            fontWeight: 'bold',
          },
        });

        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      }
    } catch (error) {
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
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col justify-center items-center py-8 px-4">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <Link href='/' className='flex justify-center items-center mb-8 gap-4'>
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
            <img
              src='/logo.png'
              alt='upcode_logo'
              className='w-10 h-10 object-contain filter brightness-0 invert'
            />
          </div>
          <h1 className='font-black text-4xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
            UPCODE
          </h1>
        </Link>

        {/* Welcome Message */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400">Sign in to continue your coding journey</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-center backdrop-blur-sm">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form className="space-y-6" onSubmit={handleLogin}>
          {/* Email or Username Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Email or Username
            </label>
            <input
              type="text"
              name="emailOrUsername"
              placeholder="Enter your email or username"
              value={emailOrUsername}
              disabled={loginInProgress}
              onChange={(ev) => setEmailOrUsername(ev.target.value)}
              className="w-full p-4 bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-xl text-white placeholder-gray-400 font-medium focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-gray-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors duration-300"
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
              className="w-full p-4 bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-xl text-white placeholder-gray-400 font-medium focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loginInProgress}
            className="w-full py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white font-bold rounded-xl hover:from-purple-600 hover:via-pink-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
          <div className="flex-1 border-t border-slate-600"></div>
          <span className="px-4 text-gray-400 text-sm font-medium">Or continue with</span>
          <div className="flex-1 border-t border-slate-600"></div>
        </div>

        {/* Social Authentication */}
        <div className="space-y-3">
          <button
            onClick={() => handleSocialAuth('google')}
            className="w-full p-4 bg-white text-gray-800 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl"
          >
            <img src="/google.png" alt="Google" className="w-5 h-5" />
            <span>Continue with Google</span>
          </button>

          <button
            onClick={() => handleSocialAuth('github')}
            className="w-full p-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl border border-gray-700"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
            </svg>
            <span>Continue with GitHub</span>
          </button>
        </div>

        {/* Register Link */}
        <div className="text-center mt-8">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <Link href="/register" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-300">
              Create account here
            </Link>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Reset Password</h2>
              <button
                onClick={() => setShowForgotPassword(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <p className="text-gray-300 mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <div className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email address"
                value={emailOrUsername.includes('@') ? emailOrUsername : ''}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                className="w-full p-4 bg-slate-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              />

              <button
                onClick={handleForgotPassword}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
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