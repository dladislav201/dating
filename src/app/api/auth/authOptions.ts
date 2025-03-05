import NextAuth, { AuthOptions, Session, User,  } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { JWT } from "next-auth/jwt";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// id added
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      nickName?: string | null;
    };
  }
  
  interface User {
    id: string;
    nickName?: string | null;
  }
}

interface JWTCallback {
  token: JWT;
  user: User;
  account: any; // TODO:
  profile?: any; // TODO: 
  trigger?: "signIn" | "signUp" | "update";
  isNewUser?: boolean;
  session?: any;
}

interface SessionCallback {
  session: Session; 
  token: JWT
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Record<"email" | "password", string> | undefined) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("⚠️ Введіть email і пароль");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("❌ Користувача з таким email не знайдено");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("🔑 Неправильний пароль. Спробуйте ще раз.");
        }

        return user;
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // adding id to token
    async jwt({ token, user, trigger, session }: JWTCallback) {
      if (user) {
        token.id = user.id;
        token.nickName = user.nickName;
        token.email = user.email;
      }

      if (trigger === "update" && session) {
        ["nickName", "email"].forEach((key) => {
          if (session[key] && session[key] !== token[key]) {
            token[key] = session[key];
          }
        });
      }

      return token;
    },

    // setup user id in session
    async session({ session, token }: SessionCallback) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.nickName = token.nickName as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login'
  },
};

export default NextAuth(authOptions);