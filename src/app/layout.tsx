import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { WatchlistProvider } from "@/context/WatchlistContext";
import { CollectionProvider } from "@/context/CollectionContext"; // Nieuwe import
import { NextAuthProvider } from "@/providers/NextAuthProvider";

export const metadata: Metadata = {
  title: "Yettivo | Media Database",
  description: "A premium movie and series database archive.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased selection:bg-blue-500/30 bg-[#0a0a0c] text-zinc-400 min-h-screen flex flex-col">
        <NextAuthProvider>
          <WatchlistProvider>
            <CollectionProvider>
              
              {/* Background Infrastructure */}
              <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[#0a0a0c]" />
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full opacity-60" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-indigo-600/10 blur-[120px] rounded-full opacity-40" />
              </div>
              
              <Navbar />
              
              {/* Main content groeit om footer naar beneden te duwen */}
              <main className="relative z-10 flex-grow">
                {children}
              </main>

              <Footer />

            </CollectionProvider>
          </WatchlistProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}