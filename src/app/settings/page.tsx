"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { KeyIcon, EnvelopeIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export default function SettingsPage() {
  const { user, login } = useAuth();
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/user/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: (user as any)?.id, 
          email, 
          newPassword: password || undefined 
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Update de lokale context zodat de Navbar ook ververst
      login(data.user);
      setStatus({ type: 'success', msg: "Account settings updated." });
      setPassword(""); 
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0c] text-white pt-32 pb-12 px-8">
      <div className="max-w-2xl mx-auto space-y-12">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-zinc-500 text-sm mt-2">Manage your archive credentials and security.</p>
        </header>

        {status && (
          <div className={`p-4 rounded-sm border ${status.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-red-500/10 border-red-500/30 text-red-500'} flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest`}>
            {status.type === 'success' && <CheckCircleIcon className="h-5 w-5" />}
            {status.msg}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-8">
          {/* Email Section */}
          <section className="space-y-4">
            <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <EnvelopeIcon className="h-4 w-4" /> Email Address
            </label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/10 rounded-sm px-4 py-3 text-sm focus:border-[#3b82f6]/50 outline-none transition-all"
            />
          </section>

          {/* Password Section */}
          <section className="space-y-4">
            <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <KeyIcon className="h-4 w-4" /> New Password
            </label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave empty to keep current password"
              className="w-full bg-white/[0.02] border border-white/10 rounded-sm px-4 py-3 text-sm focus:border-[#3b82f6]/50 outline-none transition-all"
            />
          </section>

          <button 
            type="submit"
            disabled={isLoading}
            className="bg-[#3b82f6] px-8 py-3 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </main>
  );
}