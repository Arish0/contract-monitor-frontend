"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { setSession } from "@/lib/session";

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const session = await login(email, password);
      setSession(session);
      router.replace("/");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#08060f] p-4 sm:p-8">
      <div className="w-full max-w-4xl rounded-3xl border border-white/10 bg-[#0d0a1a] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[560px]">
        {/* Left panel — brand art (abstract network art, no photo) */}
        <div className="relative hidden md:flex md:w-1/2 overflow-hidden bg-gradient-to-br from-[#1b1030] via-[#140c26] to-[#0b0715]">
          <svg viewBox="0 0 600 800" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
            <defs>
              <radialGradient id="glow1" cx="30%" cy="20%" r="60%">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="glow2" cx="80%" cy="80%" r="55%">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="nodeStroke" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#2dd4bf" />
              </linearGradient>
            </defs>
            <rect width="600" height="800" fill="url(#glow1)" />
            <rect width="600" height="800" fill="url(#glow2)" />

            <g stroke="url(#nodeStroke)" strokeWidth="1.2" fill="none" opacity="0.55">
              <path d="M120 180 L220 130 L320 180 L320 280 L220 330 L120 280 Z" />
              <path d="M320 180 L420 130 L520 180 L520 280 L420 330 L320 280" />
              <path d="M120 280 L220 330 L220 430 L120 480 L20 430 L20 330 Z" />
              <path d="M220 430 L320 380 L420 430 L420 530 L320 580 L220 530 Z" />
              <path d="M320 580 L420 530 L520 580 L520 680 L420 730 L320 680 Z" />
            </g>
            <g fill="#2dd4bf">
              <circle cx="220" cy="130" r="3.5" />
              <circle cx="320" cy="280" r="3.5" />
              <circle cx="420" cy="430" r="3.5" />
              <circle cx="220" cy="530" r="3.5" />
            </g>
            <g fill="#a78bfa">
              <circle cx="120" cy="180" r="3.5" />
              <circle cx="420" cy="130" r="3.5" />
              <circle cx="20" cy="330" r="3.5" />
              <circle cx="520" cy="580" r="3.5" />
            </g>

            <g fill="#ffffff" opacity="0.06">
              {Array.from({ length: 12 }).map((_, row) =>
                Array.from({ length: 9 }).map((_, col) => (
                  <circle key={`${row}-${col}`} cx={40 + col * 65} cy={40 + row * 65} r="1.6" />
                )),
              )}
            </g>
          </svg>

          <div className="relative z-10 flex flex-col justify-between p-8 w-full">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-400 to-teal-300 flex items-center justify-center text-[#0b0715] font-bold text-sm">
                C
              </div>
              <span className="text-white font-semibold">Contract Monitor</span>
            </div>

            <div className="max-w-sm">
              <h2 className="text-3xl font-semibold text-white leading-tight">
                Secure Operator
                <br />
                Console
              </h2>
              <p className="mt-3 text-sm text-white/50">
                Real-time monitoring for a live production system — restricted to authorized operators only.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 backdrop-blur">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-300 animate-pulse" />
              Monitoring active
            </div>
          </div>
        </div>

        {/* Right panel — login form */}
        <div className="flex flex-1 flex-col justify-center p-8 sm:p-12">
          <div className="mx-auto w-full max-w-sm flex flex-col gap-6">
            <div>
              <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1 text-xs font-medium mb-6">
                <span className="rounded-full bg-gradient-to-r from-violet-500 to-teal-400 px-4 py-1.5 text-[#0b0715]">
                  Log in
                </span>
              </div>
              <h1 className="text-2xl font-semibold text-white">Welcome back</h1>
              <p className="mt-1 text-sm text-white/40">Sign in to view the production dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-white/60">Email</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
                    <MailIcon />
                  </span>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-white/10 bg-white/5 pl-9 pr-3 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-violet-400/60 focus:ring-1 focus:ring-violet-400/60"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-white/60">Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
                    <LockIcon />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    className="w-full rounded-lg border border-white/10 bg-white/5 pl-9 pr-14 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-violet-400/60 focus:ring-1 focus:ring-violet-400/60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40 hover:text-white/70"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 rounded-lg bg-gradient-to-r from-violet-500 to-teal-400 px-4 py-2.5 text-sm font-semibold text-[#0b0715] transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Signing in…" : "Sign in"}
              </button>

              <p className="text-center text-[11px] text-white/25">Session expires automatically after 48 hours.</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
