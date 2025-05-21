import { NextAuthOptions } from "next-auth";
import CrendialProvider from "next-auth/providers/credentials";

import { loginSchema } from "@/types/loginSchema";
import { USER_LOGIN_URL } from "@/config/api-endpoints";

export const AuthOptions: NextAuthOptions = {
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CrendialProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validatedData = loginSchema.safeParse(credentials);
        if (!validatedData.success) {
          console.error(
            "Validation failed:",
            validatedData.error.flatten().fieldErrors,
          );
          return null;
        }

        const { email, password } = validatedData.data;
        try {
          const res = await fetch(USER_LOGIN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          // If the response is not OK, read its error details
          if (!res.ok) {
            const errorData = await res.json();
            console.error(
              "Invalid response from auth server:",
              res.status,
              errorData,
            );
            // Throwing an error with the message returned from the server
            throw new Error(
              errorData.message || "Invalid response from auth server",
            );
          }

          const user = await res.json();
          if (user && user.id) {
            return user;
          }

          return null;
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log("JWT callback:", token, user);
      return {
        ...token,
        ...user,
      };
    },

    async session({ session, token }) {
      console.log("Session callback:", session, token);
      if (token) {
        session.user = {
          ...session.user,
          ...token,
        };
      }
      return session;
    },
  },
};
