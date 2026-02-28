"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlusIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ 
    name: "", 
    username: "", 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed.");
        setIsLoading(false);
        return;
      }

      router.push("/auth/signin?registered=true");
    } catch (err) {
      setError("An error occurred. Please check your connection.");
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[#0a0a0c] relative overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/[0.08] blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center space-y-4">
          <div className="mx-auto h-16 w-16 bg-[#3b82f6]/10 border border-[#3b82f6]/30 rounded-sm flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.15)]">
            <UserPlusIcon className="h-8 w-8 text-[#3b82f6]" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-white tracking-tighter uppercase italic">Join Yettivo</h1>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Start your personal collection</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Full Name" 
            type="text" 
            placeholder="e.g. John Doe" 
            required
            value={formData.name} 
            onChange={(v) => setFormData({...formData, name: v})} 
          />
          <Input 
            label="Username" 
            type="text" 
            placeholder="johndoe88" 
            required
            value={formData.username} 
            onChange={(v) => setFormData({...formData, username: v})} 
          />
          <Input 
            label="Email Address" 
            type="email" 
            placeholder="name@example.com" 
            required
            value={formData.email} 
            onChange={(v) => setFormData({...formData, email: v})} 
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Password" 
              type="password" 
              placeholder="••••••••" 
              required
              value={formData.password} 
              onChange={(v) => setFormData({...formData, password: v})} 
            />
            <Input 
              label="Confirm" 
              type="password" 
              placeholder="••••••••" 
              required
              value={formData.confirmPassword} 
              onChange={(v) => setFormData({...formData, confirmPassword: v})} 
            />
          </div>

          {error && (
            <div className="flex items-center justify-center gap-2 py-3 bg-red-500/10 border border-red-500/20 rounded-sm animate-in shake duration-300">
              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">{error}</span>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className={`group relative w-full bg-[#3b82f6] text-white py-4 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all flex items-center justify-center overflow-hidden ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] active:scale-[0.98]'}`}
          >
            <span className="relative z-10 flex items-center gap-2">
              {isLoading ? (
                <>
                  <ArrowPathIcon className="h-3 w-3 animate-spin" />
                  Creating Account...
                </>
              ) : "Create Account"}
            </span>
          </button>
        </form>

        <div className="text-center space-y-6 pt-2">
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-[#3b82f6] hover:text-blue-400 transition-colors underline decoration-blue-600/30 underline-offset-4">Sign In</Link>
          </p>
          <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent w-full" />
          <p className="text-[9px] text-zinc-600 uppercase tracking-[0.15em] leading-relaxed max-w-[280px] mx-auto">
            By joining, you agree to our terms of service and privacy policy.
          </p>
        </div>
      </div>
    </main>
  );
}

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  onChange: (value: string) => void;
}

function Input({ label, onChange, ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-[9px] font-black text-zinc-500 uppercase ml-1 tracking-widest">
        {label}
      </label>
      <input 
        {...props}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-[#3b82f6]/50 focus:bg-white/5 transition-all font-medium"
      />
    </div>
  );
}