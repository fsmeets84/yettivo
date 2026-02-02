"use client";

import { signIn, useSession } from "next-auth/react";

export default function AuthButtons() {
  const { data: session } = useSession();

  if (session) return null; // We handle the logged-in state in UserMenu

  return (
    <button
      onClick={() => signIn("google")}
      className="bg-red-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-red-700 transition"
    >
      Sign In
    </button>
  );
}