import React, { useState } from "react";
import axios from "axios";

interface AuthScreenProps {
  onAuthSuccess: (token: string, user: any) => void;
}

const AuthScreen = ({ onAuthSuccess }: AuthScreenProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const bgClass = "bg-slate-50";
  const cardBg = "bg-white border-slate-200";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const apiBaseUrl = `${import.meta.env.VITE_API_URL || "http://localhost:1500"}/api`;

    try {
      if (isLogin) {
        const res = await axios.post(`${apiBaseUrl}/auth/login`, {
          username: email || username,
          password,
        });
        if (res.data.mess) {
          setError(res.data.mess);
        } else {
          onAuthSuccess(res.data.token, res.data.user);
        }
      } else {
        const res = await axios.post(`${apiBaseUrl}/auth/register`, {
          username,
          email,
          password,
        });
        if (res.data.mess) {
          setError(res.data.mess);
        } else {
          onAuthSuccess(res.data.token, res.data.user);
        }
      }
    } catch (err: any) {
      let errMsg = "Something went wrong. Please try again.";
      if (err.response) {
        if (typeof err.response.data === "string" && err.response.data.includes("<html")) {
          errMsg = `Server Error (${err.response.status}): ${err.response.statusText || "HTML Response"}`;
        } else if (err.response.data) {
          errMsg = err.response.data.error || err.response.data.message || err.response.data.mess || JSON.stringify(err.response.data);
        } else {
          errMsg = `Error (${err.response.status}): ${err.response.statusText}`;
        }
      } else if (err.message) {
        errMsg = err.message;
      } else if (err.toString) {
        errMsg = err.toString();
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${bgClass} text-slate-900`}>
      <div className={`w-full max-w-md p-8 rounded-2xl shadow-xl border ${cardBg} transition-all duration-300`}>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Foundly
          </h1>
          <p className="text-sm text-slate-500">
            {isLogin ? "Welcome back! Login to trace lost & found items." : "Create an account to join the campus portal."}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-xs text-center font-medium animate-bounce">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                placeholder="e.g. john_doe"
              />
            </div>
          )}

          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              {isLogin ? "Username or Email" : "Email Address"}
            </label>
            <input
              type={isLogin ? "text" : "email"}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
              placeholder={isLogin ? "Username or email" : "e.g. john@example.com"}
            />
          </div>

          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 text-sm mt-6 cursor-pointer shadow-lg shadow-blue-500/20"
          >
            {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-100 pt-6">
          <p className="text-xs text-slate-500">
            {isLogin ? "New to Foundly?" : "Already have an account?"}{" "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setUsername("");
                setEmail("");
                setPassword("");
              }}
              className="font-bold text-blue-600 hover:text-blue-500 transition-colors bg-transparent border-0 cursor-pointer p-0"
            >
              {isLogin ? "Create an account" : "Sign in here"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
