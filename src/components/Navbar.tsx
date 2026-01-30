import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo / Brand Name */}
        <Link 
          href="/" 
          className="text-2xl font-bold text-blue-500 tracking-tight hover:text-blue-400 transition-colors"
        >
          Yettivo
        </Link>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          <Link href="/api/auth/signin" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Login
          </Link>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
            Sign Up
          </button>
        </div>

      </div>
    </nav>
  );
}