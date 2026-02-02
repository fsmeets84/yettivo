import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { WatchlistProvider } from "@/context/WatchlistContext";
import { NextAuthProvider } from "@/providers/NextAuthProvider";

export const metadata: Metadata = {
  title: "Yettivo | Media Database",
  description: "A premium glassmorphism movie and series database archive.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased selection:bg-blue-500/30 bg-[#0a0a0c] text-zinc-400">
        {/* NextAuthProvider is nu de basis voor alle authenticatie */}
        <NextAuthProvider>
          {/* WatchlistProvider leunt nu direct op NextAuthProvider */}
          <WatchlistProvider>
            
            {/* Studio Glow Infrastructure */}
            <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-[#0a0a0c]" />
              <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full opacity-60" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-indigo-600/10 blur-[120px] rounded-full opacity-40" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/[0.02] blur-[150px]" />
            </div>
            
            <Navbar />
            
            <main className="relative z-10 bg-transparent">
              {children}
            </main>

          </WatchlistProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}