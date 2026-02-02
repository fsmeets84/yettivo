"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useWatchlist } from "@/context/WatchlistContext";
import { 
  HomeIcon, UserIcon, FilmIcon, TvIcon,
  BookmarkIcon, ChevronDownIcon, MagnifyingGlassIcon,
  ArrowRightOnRectangleIcon, Cog6ToothIcon,
  KeyIcon, UserPlusIcon
} from "@heroicons/react/24/outline";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  
  const user = session?.user as any; 

  const { watchlist } = useWatchlist();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    setIsDropdownOpen(false);
    await signOut({ callbackUrl: "/" });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] glass-nav border-b border-white/5 bg-black/60 backdrop-blur-xl">
      <div className="w-full h-16 flex items-center justify-between px-8">
        
        {/* Brand & Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-[#2563eb] rounded-sm flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-transform group-hover:scale-105">
              <div className="w-3.5 h-3.5 bg-white rounded-[1px] rotate-45" />
            </div>
            <span className="text-xl font-black text-white tracking-tighter">Yettivo</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {[
              { name: "Home", href: "/", icon: HomeIcon, iconOnly: true },
              { name: "Movies", href: "/movie", icon: FilmIcon },
              { name: "TV Shows", href: "/tv", icon: TvIcon },
            ].map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-sm transition-all duration-300 ${
                    isActive ? "text-white bg-white/10" : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon className={`h-4.5 w-4.5 ${isActive ? "text-[#3b82f6]" : "text-zinc-400"}`} />
                  {!item.iconOnly && <span className="text-[13px] font-bold tracking-tight">{item.name}</span>}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-12">
          <div className="relative group">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#3b82f6]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies & shows..."
              className="w-full bg-black/40 border border-white/10 rounded-sm py-2 pl-11 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#3b82f6]/50 transition-all font-medium"
            />
          </div>
        </form>

        {/* Account Area */}
        <div className="relative" ref={dropdownRef}>
          {isLoggedIn ? (
            <>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-sm border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all group"
              >
                <div className="w-7 h-7 rounded-sm bg-[#3b82f6] flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                  <UserIcon className="h-4 w-4 text-white" />
                </div>
                <span className="hidden sm:inline text-[11px] font-bold text-zinc-300 tracking-tight">
                  {user?.username || user?.name || user?.email?.split('@')[0]}
                </span>
                <ChevronDownIcon className={`h-3.5 w-3.5 text-[#3b82f6] transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-72 glass-dropdown overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 border border-white/10 rounded-sm bg-black/90 backdrop-blur-xl shadow-2xl">
                  <div className="px-5 py-4 border-b border-white/5 bg-white/[0.01]">
                    <p className="text-[10px] font-bold text-[#3b82f6] uppercase tracking-widest mb-1">Active Session</p>
                    <p className="text-sm font-black text-white truncate tracking-tight">
                      @{user?.username || "member"}
                    </p>
                    <p className="text-[10px] font-bold text-zinc-500 truncate mt-0.5">
                      {user?.email}
                    </p>
                  </div>
                  
                  <div className="p-2 space-y-1">
                    <DropdownItem href="/account" icon={<UserIcon className="h-4 w-4 text-emerald-400" />} label="Dashboard" onClick={() => setIsDropdownOpen(false)} />
                    <DropdownItem href="/watchlist" icon={<BookmarkIcon className="h-4 w-4 text-[#3b82f6]" />} label="My Watchlist" badge={watchlist.length} onClick={() => setIsDropdownOpen(false)} />
                    <DropdownItem href="/settings" icon={<Cog6ToothIcon className="h-4 w-4 text-zinc-500" />} label="Settings" onClick={() => setIsDropdownOpen(false)} />
                    <div className="h-px bg-white/5 my-2 mx-2" />
                    <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-400/80 hover:bg-red-500/10 transition-all rounded-sm text-left">
                      <ArrowRightOnRectangleIcon className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2">
              {/* FIXED LINK: Nu direct naar /register */}
              <Link 
                href="/auth/signup" 
                className="hidden md:flex items-center gap-2 px-4 py-2 text-zinc-400 text-[11px] font-bold uppercase tracking-widest hover:text-white transition-all"
              >
                <UserPlusIcon className="h-4 w-4" />
                Register
              </Link>

              <Link 
                href="/auth/signin" 
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-sm text-white text-[11px] font-bold uppercase tracking-widest hover:bg-[#3b82f6] hover:border-[#3b82f6] transition-all group shadow-lg"
              >
                <KeyIcon className="h-4 w-4 text-[#3b82f6] group-hover:text-white" />
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function DropdownItem({ href, icon, label, badge, onClick }: any) {
  return (
    <Link href={href} onClick={onClick} className="flex items-center justify-between px-4 py-3 rounded-sm hover:bg-white/5 transition-all group">
      <div className="flex items-center gap-3">
        <span className="flex-shrink-0">{icon}</span>
        <span className="text-sm font-bold text-zinc-400 group-hover:text-white">{label}</span>
      </div>
      {badge !== undefined && (
        <span className="text-[10px] font-black bg-[#3b82f6]/10 text-[#3b82f6] px-1.5 py-0.5 rounded-sm">
          {badge}
        </span>
      )}
    </Link>
  );
}