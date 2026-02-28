"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0a0a0c] py-12 mt-20">
      <div className="max-w-[1800px] mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          
          {/* Brand Part */}
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <div className="w-6 h-6 bg-blue-600 rounded-sm flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.2)]">
                <div className="w-2.5 h-2.5 bg-white rounded-[1px] rotate-45" />
              </div>
              <span className="text-lg font-black text-white tracking-tighter uppercase italic">
                Yettivo
              </span>
            </div>
            <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-widest">
              Personal Media Archive &copy; {new Date().getFullYear()}
            </p>
          </div>

          {/* Attribution & Legal */}
          <div className="max-w-md text-center md:text-right space-y-3">
            <p className="text-[10px] leading-relaxed text-zinc-600 uppercase tracking-wider">
              This product uses the <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-blue-500 transition-colors underline underline-offset-4 decoration-zinc-800">TMDB API</a> but is not endorsed or certified by TMDB.
            </p>
            <div className="flex justify-center md:justify-end gap-6">
              <FooterLink href="/privacy">Privacy</FooterLink>
              <FooterLink href="/terms">Terms</FooterLink>
              <FooterLink href="/about">About</FooterLink>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-[0.2em] transition-colors"
    >
      {children}
    </Link>
  );
}