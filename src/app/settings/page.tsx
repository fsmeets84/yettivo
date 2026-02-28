"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  KeyIcon, 
  EnvelopeIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  UserCircleIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [session]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/user/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          newPassword: password || undefined 
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      await update({
        ...session,
        user: {
          ...session?.user,
          email: email,
        }
      });

      setStatus({ type: 'success', msg: "Settings updated successfully" });
      setPassword(""); 
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c]">
        <div className="h-6 w-6 border-2 border-[#3b82f6]/20 border-t-[#3b82f6] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0c] text-white pt-32 pb-20 relative overflow-hidden">
      <div className="max-w-2xl mx-auto px-8 relative z-10 space-y-12">
        
        {/* Header Section */}
        <header className="space-y-4 border-b border-white/5 pb-8 animate-in fade-in slide-in-from-left-4 duration-700">
          <div className="flex items-center gap-2 text-[#3b82f6]">
            <UserCircleIcon className="h-4 w-4" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">User Preferences</span>
          </div>
          <h1 className="text-5xl font-semibold tracking-tighter leading-none">
            Settings
          </h1>
          <p className="text-zinc-500 text-sm max-w-md">
            Manage your account details and update your security credentials.
          </p>
        </header>

        {/* Status Notification */}
        {status && (
          <div className={`p-4 rounded-sm border backdrop-blur-md ${
            status.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' 
              : 'bg-red-500/10 border-red-500/30 text-red-500'
          } flex items-center gap-3 text-[10px] font-black uppercase tracking-widest animate-in fade-in zoom-in-95`}>
            {status.type === 'success' ? (
              <CheckCircleIcon className="h-4 w-4" />
            ) : (
              <ExclamationCircleIcon className="h-4 w-4" />
            )}
            {status.msg}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          
          {/* Account Info */}
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <EnvelopeIcon className="h-4 w-4 text-[#3b82f6]/60" />
              <h2 className="text-[11px] font-black text-white uppercase tracking-widest">Account Info</h2>
            </div>
            
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest px-1">
                Email Address
              </label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 rounded-sm px-4 py-4 text-sm focus:border-[#3b82f6]/50 focus:bg-white/[0.04] outline-none transition-all placeholder:text-zinc-700"
                placeholder="your@email.com"
              />
            </div>
          </section>

          {/* Security */}
          <section className="space-y-6 pt-4">
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="h-4 w-4 text-[#3b82f6]/60" />
              <h2 className="text-[11px] font-black text-white uppercase tracking-widest">Security</h2>
            </div>
            
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest px-1">
                New Password
              </label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave empty to keep current password"
                className="w-full bg-white/[0.02] border border-white/10 rounded-sm px-4 py-4 text-sm focus:border-[#3b82f6]/50 focus:bg-white/[0.04] outline-none transition-all placeholder:text-zinc-700"
              />
            </div>
          </section>

          {/* Submit Button */}
          <div className="pt-4 border-t border-white/5">
            <button 
              type="submit"
              disabled={isLoading}
              className="bg-[#3b82f6] px-10 py-4 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
            >
              {isLoading && <div className="h-3 w-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
              {isLoading ? "Processing..." : "Update Settings"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}