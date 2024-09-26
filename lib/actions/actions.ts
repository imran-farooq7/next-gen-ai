"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma/db";
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API!);

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
