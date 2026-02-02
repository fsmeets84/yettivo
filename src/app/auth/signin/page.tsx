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
  CheckCircleIcon 
} from "@heroicons/react/24/outline";

function SignInContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Uitlezen van status voor feedback aan de gebruiker
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
      // Specifieke foutmeldingen vanuit de authorize functie in authOptions
      setError(res.error === "CredentialsSignin" ? "Invalid email or password." : res.error);
    } else if (res?.ok) {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="glass-card p-10 w-full max-w-md relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.3)] border-white/10 backdrop-blur-3xl">
      {/* Header */}
      <div className="text-center mb-10 space-y-2">
        <Link href="/" className="text-4xl font-semibold text-white tracking-tighter hover:text-blue-500 transition-colors">
          Yettivo
        </Link>
        <p className="text-xs font-bold text-zinc-500 tracking-widest uppercase pt-2">Archive access</p>
      </div>

      {/* --- STATUS & ERROR MELDINGEN --- */}
      
      {/* Melding na succesvolle registratie */}
      {isRegistered && !status && (
        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-1">
          <CheckCircleIcon className="h-5 w-5 text-blue-500 shrink-0" />
          <p className="text-xs font-medium text-blue-200">Account created. Please check your email to verify your access.</p>
        </div>
      )}

      {/* Melding na succesvolle verificatie */}
      {status === "verified" && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-1">
          <CheckCircleIcon className="h-5 w-5 text-emerald-500 shrink-0" />
          <p className="text-xs font-medium text-emerald-200">Email verified successfully. You can now sign in.</p>
        </div>
      )}

      {/* Foutmeldingen (Login fout of Verificatie fout) */}
      {(error || status === "expired" || status === "invalid_token" || status === "error") && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-1">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-500 shrink-0" />
          <p className="text-xs font-medium text-red-200">
            {status === "expired" ? "Verification link expired." : 
             status === "invalid_token" ? "Invalid verification link." :
             status === "error" ? "An error occurred during verification." : 
             error}
          </p>
        </div>
      )}

      {/* Form State */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase ml-1">
            Email address
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
              className="w-full bg-white/[0.03] border border-white/5 text-white rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-zinc-700 font-medium text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase ml-1">
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
              className="w-full bg-white/[0.03] border border-white/5 text-white rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-zinc-700 font-medium text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30_px_rgba(37,99,235,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            {isLoading ? (
              <>
                <ArrowPathIcon className="h-4 w-4 animate-spin" />
                Authenticating
              </>
            ) : "Sign in"}
          </span>
        </button>

        <div className="pt-4 border-t border-white/5 text-center">
          <p className="text-[10px] text-zinc-500 font-medium leading-relaxed tracking-wide">
            Don&apos;t have an account? <Link href="/register" className="text-blue-500 hover:text-blue-400 font-bold ml-1 uppercase transition-colors">Register here</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-transparent flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/[0.05] blur-[120px] rounded-full pointer-events-none" />
      <Suspense fallback={<div className="text-white text-xs animate-pulse">Loading Archive...</div>}>
        <SignInContent />
      </Suspense>
    </main>
  );
}