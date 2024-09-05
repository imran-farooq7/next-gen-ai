import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

export const authConfig = {
	providers: [],
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
