"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API!);

export const generateText = async (prompt: string) => {
	const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
	const result = await model.generateContent(prompt);
	return {
		data: result.response.text(),
	};
};
