import { auth } from "@/auth";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/providers/AuthProvider";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Poppins } from "next/font/google";
import "./globals.css";
import UsageProvider from "@/providers/UsageProvider";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["300", "500", "700", "900"],
});

export const metadata: Metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth();

	return (
		<html lang="en">
			<body className={poppins.className}>
				<ThemeProvider attribute="class">
					<AuthProvider>
						<UsageProvider>
							<Navbar user={session?.user!} />
							{children}
							<Toaster />
						</UsageProvider>
					</AuthProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
