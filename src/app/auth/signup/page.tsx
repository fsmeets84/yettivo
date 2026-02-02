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
      // Gebruik het nieuwe pad buiten de api/auth map om 405 errors te voorkomen
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

      // Bij succes: doorsturen met de 'registered' vlag voor de succesmelding
      router.push("/auth/signin?registered=true");
    } catch (err) {
      setError("An error occurred. Please check your connection.");
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[#0a0a0c]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/[0.05] blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-4">
          <div className="mx-auto h-16 w-16 bg-[#3b82f6]/10 border border-[#3b82f6]/30 rounded-sm flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.1)]">
            <UserPlusIcon className="h-8 w-8 text-[#3b82f6]" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Create Account</h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Join the movie and series archive</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Full Name" 
            type="text" 
            placeholder="John Doe" 
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
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
            required
            value={formData.password} 
            onChange={(v) => setFormData({...formData, password: v})} 
          />
          <Input 
            label="Confirm Password" 
            type="password" 
            placeholder="••••••••" 
            required
            value={formData.confirmPassword} 
            onChange={(v) => setFormData({...formData, confirmPassword: v})} 
          />

          {error && (
            <p className="text-[10px] font-bold text-red-500 uppercase text-center py-2 bg-red-500/5 border border-red-500/20 rounded-sm animate-in fade-in slide-in-from-top-1">
              {error}
            </p>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className={`group relative w-full bg-[#3b82f6] text-white py-4 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all flex items-center justify-center overflow-hidden ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.4)]'}`}
          >
            <span className="relative z-10 flex items-center gap-2">
              {isLoading ? (
                <>
                  <ArrowPathIcon className="h-3 w-3 animate-spin" />
                  Creating Archive...
                </>
              ) : "Create Account"}
            </span>
          </button>
        </form>

        <div className="text-center space-y-4">
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-[#3b82f6] hover:text-blue-400 transition-colors">Sign In</Link>
          </p>
          <p className="text-[9px] text-zinc-600 uppercase tracking-[0.15em] leading-relaxed">
            By registering, you agree to the Yettivo terms of service and privacy policy.
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
    <div className="space-y-1">
      <label className="text-[9px] font-black text-zinc-500 uppercase ml-1">
        {label}
      </label>
      <input 
        {...props}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/[0.02] border border-white/10 rounded-sm px-4 py-3 text-sm text-white focus:outline-none focus:border-[#3b82f6]/50 transition-all font-medium"
      />
    </div>
  );
}