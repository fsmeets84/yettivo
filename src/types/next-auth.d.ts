import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Toegevoegd aan de session.user object
   */
  interface Session {
    user: {
      id: string;
      username?: string | null;
    } & DefaultSession["user"];
  }

  /**
   * Toegevoegd aan het user object bij login/authorize
   */
  interface User {
    id: string;
    username?: string | null;
  }
}

declare module "next-auth/jwt" {
  /**
   * Toegevoegd aan het JWT token
   */
  interface JWT {
    id: string;
    username?: string | null;
  }
}