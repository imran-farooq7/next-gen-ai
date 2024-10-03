"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma/db";
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API!);
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2024-06-20",
});
interface CheckoutSessionResponse {
	url?: string;
	error?: string;
}

export const generateText = async (prompt: string) => {
	const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
	const result = await model.generateContent(prompt);
	return {
		data: result.response.text(),
	};
};
export const saveQuery = async ({
	template,
	email,
	content,
	query,
}: {
	template: any;
	email: string;
	content: string;
	query: string;
}) => {
	try {
		const newQuery = await prisma.query.create({
			data: {
				email,
				query,
				template,
				content,
			},
		});
		return {
			status: "success",
		};
	} catch (error) {
		return {
			status: "error",
		};
	}
};
export const getAllQueries = async () => {
	const session = await auth();
	const queries = await prisma.query.findMany({
		where: {
			email: session?.user?.email!,
		},
	});
	if (queries.length > 0) {
		return {
			status: "success",
			data: queries,
		};
	} else {
		return {
			status: "error",
			message: "Something went wrong",
		};
	}
};
export const countUsage = async () => {
	const session = await auth();
	const currentDate = new Date();
	const currentMonth = currentDate.getMonth() + 1;
	const currentYear = currentDate.getFullYear();
	// const count = await prisma.query.aggregate({
	// 	where: {
	// 		email: session?.user?.email!,

	// 			createdAt:{
	// 				equals:{
	// 					getFullYear: currentYear,
	// 					},
	// 				}
	// 			}
	// 		}
	// 	},
	const records = await prisma.query.findMany({
		where: {
			email: session?.user?.email!,
			createdAt: {
				gte: new Date(currentYear, currentMonth - 1, 1), // Start of the current month
				lt: new Date(currentYear, currentMonth, 0, 23, 59, 59), // End of the current month
			},
		},
		select: {
			content: true,
		},
	});
	return records;
};

export const createCheckoutSession =
	async (): Promise<CheckoutSessionResponse> => {
		const session = await auth();
		if (!session?.user?.email) {
			return {
				error: "User not found",
			};
		}
		try {
			const existingUser = await prisma.transaction.findFirst({
				where: {
					email: session.user.email,
				},
			});
			if (existingUser) {
				const subscription = await stripe.subscriptions.list({
					customer: existingUser.customerId,
					status: "all",
					limit: 1,
				});
				const currentSubscription = subscription.data.find(
					(sub) => sub.status === "active"
				);
				if (currentSubscription) {
					return {
						error: "you already have active subscription",
					};
				}
			}
			const checkoutSession = await stripe.checkout.sessions.create({
				payment_method_types: ["card"],
				line_items: [
					{
						price: process.env.STRIPE_PRODUCT_PRICE_ID,
						quantity: 1,
					},
				],
				mode: "subscription",
				customer_email: session.user.email,
				success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
				cancel_url: `${process.env.NEXT_PUBLIC_URL}`,
			});
			return {
				url: checkoutSession.url!,
			};
		} catch (error) {
			return {
				error: "Something went wrong while creating checkout session",
			};
		}
	};
export const checkSubscriptionStatus = async () => {
	const session = await auth();
	try {
		const transaction = await prisma.transaction.findFirst({
			where: {
				email: session?.user?.email!,
				status: "complete",
			},
		});
		if (transaction && transaction.subscriprionId) {
			const subscription = await stripe.subscriptions.retrieve(
				transaction.subscriprionId
			);
			if (subscription.status === "active") {
				return {
					status: "active",
				};
			} else {
				return {
					status: "inactive",
				};
			}
		}
	} catch (error) {
		return {
			status: "error",
			message: "Something went wrong while checking subscription status",
		};
	}
};
export const createCustomerPortalSession = async () => {
	const session = await auth();
	try {
		const transaction = await prisma.transaction.findFirst({
			where: {
				email: session?.user?.email!,
			},
		});
		if (transaction) {
			const portal = await stripe.billingPortal.sessions.create({
				customer: transaction.customerId,
				return_url: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
			});
			return {
				url: portal.url ?? `${process.env.NEXT_PUBLIC_URL}/dashboard`,
			};
		}
	} catch (error) {
		console.log(error);
	}
};
