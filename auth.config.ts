import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthConfig } from "next-auth";
import github from "next-auth/providers/github";
import { NextResponse } from "next/server";
import { prisma } from "./prisma/db";

export const authConfig = {
	adapter: PrismaAdapter(prisma),
	providers: [github],
	session: {
		strategy: "jwt",
	},
	callbacks: {
		authorized({ auth, request: { nextUrl } }) {
			const isLoggedIn = !!auth?.user;
			const isOnDashboard = nextUrl.pathname.includes("/dashboard");
			if (isOnDashboard) {
				if (isLoggedIn) return true;
				return false;
			} else if (isOnDashboard && !isLoggedIn) {
				return NextResponse.redirect(new URL("/api/auth/sigin", nextUrl));
			}
			return true;
		},
	},
} satisfies NextAuthConfig;
