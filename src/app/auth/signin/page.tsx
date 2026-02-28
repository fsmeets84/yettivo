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
  UserIcon
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
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-600/[0.08] blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="bg-white/[0.02] border border-white/10 backdrop-blur-3xl p-10 rounded-sm shadow-2xl">
        {/* Header */}
        <div className="text-center mb-10 space-y-4">
          <div className="mx-auto h-16 w-16 bg-[#3b82f6]/10 border border-[#3b82f6]/30 rounded-sm flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.15)]">
            <UserIcon className="h-8 w-8 text-[#3b82f6]" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Welcome Back</h1>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Sign in to your account</p>
          </div>
        </div>

        {/* --- MESSAGES --- */}
        
        {isRegistered && !status && (
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-1">
            <CheckCircleIcon className="h-5 w-5 text-blue-500 shrink-0" />
            <p className="text-[11px] font-bold text-blue-200 uppercase tracking-tight">Account created. Please check your email to verify your access.</p>
          </div>
        )}

        {status === "verified" && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-1">
            <CheckCircleIcon className="h-5 w-5 text-emerald-500 shrink-0" />
            <p className="text-[11px] font-bold text-emerald-200 uppercase tracking-tight">Email verified. You can now sign in.</p>
          </div>
        )}

        {(error || status === "expired" || status === "invalid_token" || status === "error") && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-sm flex items-start gap-3 animate-in fade-in shake duration-300">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500 shrink-0" />
            <p className="text-[11px] font-bold text-red-200 uppercase tracking-tight">
              {status === "expired" ? "Verification link expired." : 
               status === "invalid_token" ? "Invalid verification link." :
               status === "error" ? "An error occurred during verification." : 
               error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-[9px] font-black text-zinc-500 uppercase ml-1 tracking-widest">
              Email Address
            </label>
            <div className="relative group">
              <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
              <input
                id="email"
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 text-white rounded-sm pl-12 pr-4 py-4 focus:outline-none focus:border-[#3b82f6]/50 transition-all placeholder:text-zinc-700 font-medium text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-[9px] font-black text-zinc-500 uppercase ml-1 tracking-widest">
              Password
            </label>
            <div className="relative group">
              <KeyIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
              <input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 text-white rounded-sm pl-12 pr-4 py-4 focus:outline-none focus:border-[#3b82f6]/50 transition-all placeholder:text-zinc-700 font-medium text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`group relative w-full bg-[#3b82f6] text-white py-4 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all flex items-center justify-center overflow-hidden ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] active:scale-[0.98]'}`}
          >
            <span className="relative z-10 flex items-center gap-2">
              {isLoading ? (
                <>
                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : "Sign In"}
            </span>
          </button>

          <div className="pt-6 border-t border-white/5 text-center space-y-4">
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">
              Don&apos;t have an account? <Link href="/auth/signup" className="text-[#3b82f6] hover:text-blue-400 underline decoration-blue-600/30 underline-offset-4 transition-all">Sign up</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0c] flex items-center justify-center px-4 relative overflow-hidden">
      <Suspense fallback={<div className="text-[#3b82f6] text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Loading...</div>}>
        <SignInContent />
      </Suspense>
    </main>
  );
}