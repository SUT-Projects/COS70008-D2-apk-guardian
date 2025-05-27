import { NextAuthOptions } from "next-auth";
import CrendialProvider from "next-auth/providers/credentials";

import { loginSchema } from "@/types/loginSchema";
import { USER_LOGIN_URL } from "@/config/api-endpoints";
import { jwtDecode } from "jwt-decode";

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

          const result = await res.json();
          console.log("Auth response:", result);
          if (result.error) {
            console.error("Authentication error:", result.message);
            throw new Error(result.message);
          }

          return {
            ...result.user,
            access_token: result.access_token,
            refresh_token: result.refresh_token,
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour
  },
  callbacks: {

    async jwt({ token, user }) {
      console.log("JWT callback:", token, user);
      if (user) {
        const loginUser = user as any;
        // If user is present, it means this is the first time the JWT is being created
        const { exp } = jwtDecode(loginUser.access_token)
        
        token.access_token = loginUser.access_token;
        token.refresh_token = loginUser.refresh_token;
        token.user_type = loginUser.user_type;
        token.expiry = new Date(exp! * 1000).toISOString(); // Convert to ISO string
      }
      return {
        ...token,
        ...user,
      };
    },

    async session({ session, token }) {
      if (token) {
        session.expires = (token.expiry as any) || new Date(Date.now() + 60 * 60 * 1000).toISOString(); // Default to 1 hour if expiry is not set
        session.user = {
          ...session.user,
          ...token,
        };
      }
      return session;
    },
  },
};
