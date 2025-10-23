"use client";
import { useState, useRef } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [registerInProgress, setRegisterInProgress] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const router = useRouter();

  // Check username availability
  const checkUsername = async (username) => {
    if (username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    setCheckingUsername(true);
    try {
      const response = await fetch(`/api/check-username?username=${username}`);
      const data = await response.json();
      setUsernameAvailable(data.available);
    } catch (error) {
      console.error("Error checking username:", error);
    } finally {
      setCheckingUsername(false);
    }
  };

  // Debounce timer ref
  const debounceTimer = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Check username availability when typing
    if (name === "username") {
      // Clear previous timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      
      // Reset username availability state
      setUsernameAvailable(null);
      
      // Set new timer
      debounceTimer.current = setTimeout(() => {
        checkUsername(value);
      }, 500);
    }
  };

  const validateForm = () => {
    if (!formData.username || formData.username.length < 3) {
      setError("Username must be at least 3 characters long");
      return false;
    }
    
    // Username format validation
    if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      setError("Username can only contain letters, numbers, and underscores");
      return false;
    }
    
    if (!formData.email) {
      setError("Email is required");
      return false;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    
    if (!formData.password || formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    
    if (usernameAvailable === false) {
      setError("Username is already taken");
      return false;
    }
    return true;
  };

  async function handleRegister(ev) {
    ev.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setRegisterInProgress(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (response.ok) {
        // Show success message first
        setSuccess("Account created successfully! Logging you in...");
        setError("");
        
        // Auto-login after successful registration
        try {
          const signInResult = await signIn('credentials', {
            email: formData.email,
            password: formData.password,
            callbackUrl: '/dashboard',
            redirect: false
          });

          if (signInResult?.ok) {
            // Success - redirect will happen automatically
            router.push('/dashboard');
          } else {
            // Registration successful but auto-login failed
            setError("Account created successfully! Please log in manually.");
            router.push('/login');
          }
        } catch (signInError) {
          console.error('Auto-login failed:', signInError);
          setError("Account created successfully! Please log in manually.");
          router.push('/login');
        }
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error('Registration network error:', error);
      setError("Network error. Please try again.");
    }

    setRegisterInProgress(false);
  }

  const handleSocialAuth = async (provider) => {
    try {
      console.log(`Attempting ${provider} authentication for sign up...`);
      setError(''); // Clear any existing errors
      
      // For register page, we're creating new accounts or signing in existing ones
      const result = await signIn(provider, { 
        callbackUrl: '/setup-profile', // New users should go to profile setup
        redirect: true 
      });

      console.log(`${provider} registration result:`, result);

      // If there's an error in the result, show it
      if (result?.error) {
        console.error(`${provider} registration error:`, result.error);
        setError(`${provider} registration failed: ${result.error}`);
      }

    } catch (error) {
      console.error(`${provider} registration error:`, error);
      setError(`${provider} authentication failed. Please try again.`);
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
          <h2 className="text-3xl font-bold theme-text mb-2">Join the Community 🚀</h2>
          <p className="theme-text-secondary">Create your account and start your coding journey</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-center backdrop-blur-sm">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-300 text-center backdrop-blur-sm">
            {success}
          </div>
        )}

        {/* Registration Form */}
        <form className="space-y-6 animate-fade-in-up animation-delay-300" onSubmit={handleRegister}>
          {/* Username Field */}
          <div className="relative">
            <label className="block text-sm font-semibold theme-text mb-2">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                name="username"
                placeholder="Choose a unique username"
                value={formData.username}
                disabled={registerInProgress}
                onChange={handleInputChange}
                className="w-full p-4 theme-surface backdrop-blur-sm border theme-border rounded-xl theme-text placeholder-gray-400 font-medium focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 hover:border-blue-400"
                required
                minLength={3}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                {checkingUsername && (
                  <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                )}
                {!checkingUsername && usernameAvailable === true && (
                  <span className="text-green-400 text-xl">✓</span>
                )}
                {!checkingUsername && usernameAvailable === false && (
                  <span className="text-red-400 text-xl">✗</span>
                )}
              </div>
            </div>
            {formData.username.length >= 3 && (
              <p className={`text-xs mt-1 ${usernameAvailable === true ? 'text-green-400' :
                  usernameAvailable === false ? 'text-red-400' : 'text-gray-400'
                }`}>
                {usernameAvailable === true && '✓ Username is available'}
                {usernameAvailable === false && '✗ Username is already taken'}
                {usernameAvailable === null && 'Checking availability...'}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold theme-text mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              disabled={registerInProgress}
              onChange={handleInputChange}
              className="w-full p-4 theme-surface backdrop-blur-sm border border-slate-600 rounded-xl text-white placeholder-gray-400 font-medium focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold theme-text mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Create a strong password"
              value={formData.password}
              disabled={registerInProgress}
              onChange={handleInputChange}
              className="w-full p-4 theme-surface backdrop-blur-sm border border-slate-600 rounded-xl text-white placeholder-gray-400 font-medium focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
              required
              minLength={6}
            />
            <p className="text-xs text-gray-400 mt-1">Must be at least 6 characters long</p>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              disabled={registerInProgress}
              onChange={handleInputChange}
              className="w-full p-4 theme-surface backdrop-blur-sm border border-slate-600 rounded-xl text-white placeholder-gray-400 font-medium focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
              required
            />
            {formData.confirmPassword && (
              <p className={`text-xs mt-1 ${formData.password === formData.confirmPassword ? 'text-green-400' : 'text-red-400'
                }`}>
                {formData.password === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
              </p>
            )}
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={registerInProgress || usernameAvailable === false}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none active:scale-95"
          >
            {registerInProgress ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Account...
              </div>
            ) : (
              "Create Account"
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
            className="w-full p-4 theme-surface text-white font-semibold rounded-xl hover:theme-surface-elevated transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl border theme-border hover:scale-105 active:scale-95"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
            </svg>
            <span>Continue with GitHub</span>
          </button>
        </div>

        {/* Login Link */}
        <div className="text-center mt-8">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="theme-accent hover:theme-text-secondary font-semibold transition-colors duration-300">
              Sign in here
            </Link>
          </p>
        </div>

        {/* Terms and Privacy */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="theme-accent hover:theme-text-secondary transition-colors duration-300">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="theme-accent hover:theme-text-secondary transition-colors duration-300">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
