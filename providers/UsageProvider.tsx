"use client";

import { countUsage } from "@/lib/actions/actions";
import { createContext, useEffect, useState } from "react";
interface Count {
	count: number;
	getUsage: () => Promise<void>;
}
export const CountContext = createContext<Count | null>(null);
const UsageProvider = ({ children }: { children: React.ReactNode }) => {
	const [count, setCount] = useState(0);
	useEffect(() => {
		getUsage();
	}, [count]);
	const getUsage = async () => {
		const words = await countUsage();
		const totalWords = words.reduce((sum, record) => {
			// Trim and split the content to calculate word count
			const wordCount = record?.content?.trim().split(/\s+/).length;
			return sum + wordCount!;
		}, 0);
		setCount(totalWords);
	};
	return (
		<CountContext.Provider value={{ count, getUsage }}>
			{children}
		</CountContext.Provider>
	);
};

export default UsageProvider;
