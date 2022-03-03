import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

const prisma = new PrismaClient();

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "github") {
        const currUser = await prisma.user.findUnique({
          where: {
            githubAuthId: user.id,
          },
        });
        //if user doesn't exist in database, create new user
        if (!currUser) {
          await prisma.user.create({
            data: {
              name: user.name,
              githubAuthId: user.id,
            },
          });
        }
      }
      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      const currUser = await prisma.user.findUnique({
        where: {
          githubAuthId: token.sub,
        },
      });
      session.user.id = currUser.id;
      return session;
    },
  },
});
