export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-slate-500 text-sm mb-2">
          &copy; {new Date().getFullYear()} Yettivo. All rights reserved.
        </p>
        <p className="text-slate-600 text-xs">
          Powered by <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer" className="hover:text-blue-500 transition-colors underline">TMDB API</a>. 
          This product uses the TMDB API but is not endorsed or certified by TMDB.
        </p>
      </div>
    </footer>
  );
}