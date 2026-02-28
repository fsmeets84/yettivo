"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  UserPlusIcon, 
  ArrowPathIcon, 
  UserIcon, 
  ShieldCheckIcon 
} from "@heroicons/react/24/outline";
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
    <main className="min-h-screen flex items-center justify-center p-6 bg-[#0a0a0c] relative overflow-hidden text-zinc-400">
      {/* Verbeterde Achtergrond Gloed */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/[0.05] blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="bg-[#0d0d0f]/80 border border-white/5 backdrop-blur-2xl p-10 rounded-sm shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative overflow-hidden">
          
          {/* Subtiel patroon accent */}
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <ShieldCheckIcon className="h-32 w-32 text-white" />
          </div>

          {/* Header */}
          <div className="text-center mb-10 space-y-5 relative z-10">
            <div className="mx-auto h-16 w-16 bg-blue-600/10 border border-blue-500/20 rounded-sm flex items-center justify-center shadow-2xl">
              <UserPlusIcon className="h-8 w-8 text-blue-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-[11px] font-black text-blue-500 uppercase tracking-[0.3em]">
                Registration Protocol
              </h2>
              <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">
                Create Account
              </h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <Input 
              label="Legal Name" 
              type="text" 
              placeholder="e.g. John Doe" 
              required
              value={formData.name} 
              onChange={(v) => setFormData({...formData, name: v})} 
            />
            <Input 
              label="Archive Handle" 
              type="text" 
              placeholder="johndoe88" 
              required
              value={formData.username} 
              onChange={(v) => setFormData({...formData, username: v})} 
            />
            <Input 
              label="Identity (Email)" 
              type="email" 
              placeholder="name@example.com" 
              required
              value={formData.email} 
              onChange={(v) => setFormData({...formData, email: v})} 
            />
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Passkey" 
                type="password" 
                placeholder="••••••••" 
                required
                value={formData.password} 
                onChange={(v) => setFormData({...formData, password: v})} 
              />
              <Input 
                label="Verify" 
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
              className={`group relative w-full bg-blue-600 text-white py-4 rounded-sm text-[11px] font-black uppercase tracking-[0.25em] shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center overflow-hidden ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-500 hover:shadow-blue-600/40 active:scale-[0.98]'}`}
            >
              <span className="relative z-10 flex items-center gap-3">
                {isLoading ? (
                  <>
                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                    Initializing...
                  </>
                ) : "Establish Access"}
              </span>
            </button>
          </form>

          <div className="text-center space-y-6 pt-8 mt-4 border-t border-white/5 relative z-10">
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">
              Existing Member?{" "}
              <Link href="/auth/signin" className="text-blue-500 hover:text-white transition-all underline underline-offset-4 decoration-blue-500/30">Sign In</Link>
            </p>
            <p className="text-[9px] text-zinc-600 uppercase font-black tracking-[0.15em] leading-relaxed max-w-[280px] mx-auto opacity-60">
              By establishing access, you agree to our data protocols and service terms.
            </p>
          </div>
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
    <div className="space-y-2">
      <label className="text-[10px] font-black text-zinc-500 uppercase ml-1 tracking-widest">
        {label}
      </label>
      <input 
        {...props}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/[0.02] border border-white/10 rounded-sm px-4 py-4 text-xs text-white placeholder:text-zinc-800 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.04] transition-all font-bold uppercase tracking-widest"
      />
    </div>
  );
}