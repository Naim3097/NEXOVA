"use client";

import React, { useState } from "react";
import { LogIn, User, Lock, AlertCircle, Eye, EyeOff, CheckCircle, Loader2 } from "lucide-react";

interface LoginWidgetProps {
  showLabel?: boolean;
  buttonText?: string;
  showRegister?: boolean;
  showLostPassword?: boolean;
  redirectAfterLogin?: string;
  labels?: {
    username?: string;
    password?: string;
    remember?: string;
    login?: string;
    lostPassword?: string;
    register?: string;
    welcome?: string;
    subtitle?: string;
  };
}

export default function LoginWidget({
  showLabel = true,
  buttonText = "Log In",
  showRegister = true,
  showLostPassword = true,
  redirectAfterLogin = "/dashboard",
  labels = {
    username: "Username or Email",
    password: "Password",
    remember: "Remember Me",
    login: "Log In",
    lostPassword: "Forgot Password?",
    register: "Register Now",
    welcome: "Welcome Back",
    subtitle: "Please sign in to your account"
  },
}: LoginWidgetProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "", remember: false });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!credentials.username || !credentials.password) {
      setError("Please enter both username and password.");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (credentials.username.toLowerCase() === "admin" && credentials.password === "password") {
        setIsLoggedIn(true);
      } else {
        setError("Invalid username or password. Try 'admin' / 'password'.");
      }
    }, 1500);
  };

  if (isLoggedIn) {
    return (
      <div className="w-full max-w-sm mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-100 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
          <CheckCircle size={32} />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back!</h3>
        <p className="text-gray-500 mb-6">You have successfully logged in.</p>
        <button 
          onClick={() => setIsLoggedIn(false)}
          className="text-sm text-blue-600 hover:underline font-medium"
        >
          Log out
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-100 relative overflow-hidden">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-600 ring-4 ring-blue-50/50">
          <LogIn size={24} />
        </div>
        <h3 className="text-xl font-bold text-gray-800">{labels.welcome}</h3>
        <p className="text-sm text-gray-500 mt-1">{labels.subtitle}</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          {showLabel && <label className="block text-sm font-medium text-gray-700 mb-1.5">{labels.username}</label>}
          <div className="relative group">
            <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${error ? "border-red-300 bg-red-50/30" : "border-gray-200"}`}
              placeholder="admin"
            />
          </div>
        </div>
        
        <div>
          {showLabel && <label className="block text-sm font-medium text-gray-700 mb-1.5">{labels.password}</label>}
          <div className="relative group">
            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type={showPassword ? "text" : "password"}
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${error ? "border-red-300 bg-red-50/30" : "border-gray-200"}`}
              placeholder="password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="remember" 
              checked={credentials.remember}
              onChange={(e) => setCredentials({...credentials, remember: e.target.checked})}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer" 
            />
            <label htmlFor="remember" className="ml-2 block text-gray-600 cursor-pointer select-none">{labels.remember}</label>
          </div>
          {showLostPassword && (
            <a href="#" className="text-blue-600 hover:text-blue-700 hover:underline font-medium">
              {labels.lostPassword}
            </a>
          )}
        </div>

        {error && (
          <div className="flex items-start gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100 animate-in slide-in-from-top-1">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 px-4 rounded-lg transition-all shadow-sm hover:shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Logging in...</span>
            </>
          ) : (
            <>
              <span>{buttonText}</span>
              <LogIn size={18} />
            </>
          )}
        </button>

        {(showRegister || showLostPassword) && (
          <div className="text-center mt-6 pt-4 border-t border-gray-100">
            {showRegister && (
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                  {labels.register}
                </a>
              </p>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
