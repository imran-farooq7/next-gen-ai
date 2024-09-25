"use server";

import { Template } from "@/app/dashboard/templates/[slug]/page";
import { prisma } from "@/prisma/db";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { InputJsonValue } from "@prisma/client/runtime/library";
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
