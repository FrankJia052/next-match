import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"

import authConfig from "./auth.config"
import { prisma } from "./lib/prisma"
 
export const { auth, handlers: {GET, POST}, signIn, signOut } = NextAuth({
  callbacks: {
    // 注意next.auth中jwt callback的用法
    async jwt({user, token}) {
      if(user) {
        console.log({user})
        // 重点
        token.profileComplete = user.profileComplete;
      }
      return token;
    },
    async session({token, session}) {
      if (token.sub && session.user) {
        session.user.id = token.sub
        // 重点
        session.user.profileComplete = token.profileComplete as boolean;
      }
      return session
    }
  },
  adapter: PrismaAdapter(prisma),
  session: {strategy: "jwt"},
  ...authConfig,
})