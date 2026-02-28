"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useWatchlist } from "@/context/WatchlistContext";
import { useCollections } from "@/context/CollectionContext"; // Nieuwe import
import { 
  UserIcon, 
  FilmIcon, 
  TvIcon, 
  BookmarkIcon, 
  ChevronDownIcon, 
  MagnifyingGlassIcon,
  ArrowRightOnRectangleIcon, 
  Cog6ToothIcon,
  CalendarIcon,
  Squares2X2Icon,
  HomeIcon,
  RectangleStackIcon // Nieuw icoon
} from "@heroicons/react/24/outline";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const user = session?.user as any; 

  const { watchlist } = useWatchlist();
  const { collections } = useCollections(); // Haal collecties op voor de badge
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    setIsDropdownOpen(false);
    await signOut({ callbackUrl: "/" });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] h-16 bg-[#0a0a0c]/80 backdrop-blur-xl border-b border-white/5">
      <div className="w-full h-full flex items-center justify-between px-8 max-w-[1800px] mx-auto">
        
        {/* Brand & Main Nav */}
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-3 group transition-transform active:scale-95">
            <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.3)]">
              <div className="w-3.5 h-3.5 bg-white rounded-[1px] rotate-45" />
            </div>
            <span className="text-xl font-bold text-white tracking-tighter">Yettivo</span>
          </Link>

          <div className="hidden lg:flex items-center gap-2">
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
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-sm transition-all duration-200 ${
                    isActive ? "text-white bg-white/10" : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon className={`h-4.5 w-4.5 ${isActive ? "text-blue-500" : "text-zinc-400"}`} />
                  {!item.iconOnly && <span className="text-[13px] font-medium tracking-tight">{item.name}</span>}
                </Link>
              );
            })}

            {isLoggedIn && (
              <Link 
                href="/calendar" 
                className={`flex items-center gap-2 px-3 py-1.5 rounded-sm transition-all relative ${
                  pathname === "/calendar" ? "text-white bg-white/10" : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <CalendarIcon className={`h-4.5 w-4.5 ${pathname === "/calendar" ? "text-blue-500" : "text-zinc-400"}`} />
                <span className="text-[13px] font-medium tracking-tight">Calendar</span>
                <span className="absolute top-1.5 right-1.5 w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
              </Link>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-12">
          <div className="relative group">
            <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies, shows or cast..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-sm py-2 pl-10 pr-4 text-[13px] text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all font-medium"
            />
          </div>
        </form>

        {/* Account Area */}
        <div className="relative" ref={dropdownRef}>
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-sm border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all group active:scale-95"
              >
                <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center shadow-inner group-hover:border-blue-500/50 transition-colors">
                  <UserIcon className="h-4 w-4 text-zinc-400 group-hover:text-blue-500 transition-colors" />
                </div>
                <span className="hidden sm:inline text-[13px] font-semibold text-zinc-300 tracking-tight">
                  {user?.username || user?.name || "Member"}
                </span>
                <ChevronDownIcon className={`h-3.5 w-3.5 text-zinc-600 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 top-[calc(100%+12px)] w-64 bg-[#0d0d0f] border border-white/10 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[110]">
                  <div className="px-5 py-4 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                       <div className="h-8 w-8 rounded-sm bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
                          <UserIcon className="h-4 w-4 text-blue-500" />
                       </div>
                       <div>
                          <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider leading-none">User Account</p>
                          <p className="text-sm font-bold text-white truncate mt-1">
                            {user?.username || user?.name || "Member"}
                          </p>
                       </div>
                    </div>
                  </div>
                  
                  <div className="p-1 space-y-0.5">
                    <DropdownItem href="/account" icon={<Squares2X2Icon className="h-4 w-4" />} label="Dashboard" onClick={() => setIsDropdownOpen(false)} />
                    <DropdownItem href="/watchlist" icon={<BookmarkIcon className="h-4 w-4" />} label="My Watchlist" badge={watchlist.length} onClick={() => setIsDropdownOpen(false)} />
                    
                    {/* Nieuwe Collections optie met violette badge */}
                    <DropdownItem 
                      href="/account/collection" 
                      icon={<RectangleStackIcon className="h-4 w-4" />} 
                      label="My Collections" 
                      badge={collections.length} 
                      badgeColor="bg-violet-500/10 text-violet-500"
                      activeColor="group-hover:text-violet-500"
                      onClick={() => setIsDropdownOpen(false)} 
                    />

                    <DropdownItem href="/calendar" icon={<CalendarIcon className="h-4 w-4" />} label="Release Calendar" onClick={() => setIsDropdownOpen(false)} />
                    <DropdownItem href="/settings" icon={<Cog6ToothIcon className="h-4 w-4" />} label="Settings" onClick={() => setIsDropdownOpen(false)} />
                    
                    <div className="h-px bg-white/5 my-1 mx-2" />
                    
                    <button 
                      onClick={handleSignOut} 
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-semibold text-red-500 hover:bg-red-500/10 transition-all rounded-sm text-left"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-5">
              <Link href="/auth/signin" className="text-[13px] font-semibold text-zinc-400 hover:text-white transition-all">Sign in</Link>
              <Link href="/auth/signup" className="px-5 py-2 bg-blue-600 text-white text-[13px] font-bold rounded-sm hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] active:scale-95">Get started</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function DropdownItem({ href, icon, label, badge, badgeColor, activeColor, onClick }: any) {
  return (
    <Link href={href} onClick={onClick} className="flex items-center justify-between px-4 py-2.5 rounded-sm hover:bg-white/5 transition-all group">
      <div className="flex items-center gap-3">
        <span className={`text-zinc-500 transition-colors ${activeColor || "group-hover:text-blue-500"}`}>{icon}</span>
        <span className="text-[13px] font-semibold text-zinc-300 group-hover:text-white transition-colors">{label}</span>
      </div>
      {badge !== undefined && (
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-sm ${badgeColor || "bg-blue-500/10 text-blue-500"}`}>
          {badge}
        </span>
      )}
    </Link>
  );
}