"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  EnvelopeIcon, 
  KeyIcon, 
  ArrowPathIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  UserIcon,
  LockClosedIcon
} from "@heroicons/react/24/outline";

function SignInContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const status = searchParams.get("status");
  const isRegistered = searchParams.get("registered") === "true";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const res = await signIn("credentials", { 
      email, 
      password,
      redirect: false,
      callbackUrl: "/" 
    });

    setIsLoading(false);

    if (res?.error) {
      setError(res.error === "CredentialsSignin" ? "Invalid email or password." : res.error);
    } else if (res?.ok) {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-700">
      {/* Verbeterde Achtergrond Gloed */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/[0.05] blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="bg-[#0d0d0f]/80 border border-white/5 backdrop-blur-2xl p-10 rounded-sm shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative overflow-hidden">
        {/* Subtiel patroon accent */}
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <LockClosedIcon className="h-32 w-32 text-white" />
        </div>

        {/* Header */}
        <div className="text-center mb-10 space-y-5 relative z-10">
          <div className="mx-auto h-16 w-16 bg-blue-600/10 border border-blue-500/20 rounded-sm flex items-center justify-center shadow-2xl">
            <UserIcon className="h-8 w-8 text-blue-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-[11px] font-black text-blue-500 uppercase tracking-[0.3em]">
              Security Access
            </h2>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">
              Welcome Back
            </h1>
          </div>
        </div>

        {/* --- MESSAGES --- */}
        
        {isRegistered && !status && (
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-1">
            <CheckCircleIcon className="h-5 w-5 text-blue-500 shrink-0" />
            <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest leading-relaxed">Account created. Please check your email to verify access.</p>
          </div>
        )}

        {status === "verified" && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-1">
            <CheckCircleIcon className="h-5 w-5 text-emerald-500 shrink-0" />
            <p className="text-[10px] font-black text-emerald-200 uppercase tracking-widest leading-relaxed">Email verified. Authentication protocol active.</p>
          </div>
        )}

        {(error || status === "expired" || status === "invalid_token" || status === "error") && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-sm flex items-start gap-3 animate-in fade-in shake duration-300">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500 shrink-0" />
            <p className="text-[10px] font-black text-red-200 uppercase tracking-widest leading-relaxed">
              {status === "expired" ? "Link expired." : 
               status === "invalid_token" ? "Invalid token." :
               status === "error" ? "System error." : 
               error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label htmlFor="email" className="text-[10px] font-black text-zinc-500 uppercase ml-1 tracking-widest">
              Identity (Email)
            </label>
            <div className="relative group">
              <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
              <input
                id="email"
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 text-white rounded-sm pl-12 pr-4 py-4 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.04] transition-all placeholder:text-zinc-800 font-bold text-xs uppercase tracking-widest"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-[10px] font-black text-zinc-500 uppercase ml-1 tracking-widest">
              Passkey
            </label>
            <div className="relative group">
              <KeyIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
              <input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 text-white rounded-sm pl-12 pr-4 py-4 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.04] transition-all placeholder:text-zinc-800 font-bold text-xs tracking-widest"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`group relative w-full bg-blue-600 text-white py-4 rounded-sm text-[11px] font-black uppercase tracking-[0.25em] shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center overflow-hidden ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-500 hover:shadow-blue-600/40 active:scale-[0.98]'}`}
          >
            <span className="relative z-10 flex items-center gap-3">
              {isLoading ? (
                <>
                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : "Authenticate"}
            </span>
          </button>

          <div className="pt-8 border-t border-white/5 text-center">
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">
              New to the platform? <Link href="/auth/signup" className="text-blue-500 hover:text-white transition-all underline underline-offset-4 decoration-blue-500/30">Create Account</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0c] flex items-center justify-center px-4 relative overflow-hidden text-zinc-400">
      <Suspense fallback={<div className="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Initializing...</div>}>
        <SignInContent />
      </Suspense>
    </main>
  );
}