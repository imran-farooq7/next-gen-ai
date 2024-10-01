"use client";

import { checkSubscriptionStatus, countUsage } from "@/lib/actions/actions";
import {
	createContext,
	Dispatch,
	SetStateAction,
	useEffect,
	useState,
} from "react";
interface Count {
	count: number;
	getUsage: () => Promise<void>;
	openModal: boolean;
	setOpenModal: Dispatch<SetStateAction<boolean>>;
	subStatus: string;
}
export const CountContext = createContext<Count | null>(null);
const UsageProvider = ({ children }: { children: React.ReactNode }) => {
	const [openModal, setOpenModal] = useState(false);
	const [count, setCount] = useState(0);
	const [subStatus, setSubStatus] = useState("");
	useEffect(() => {
		getUsage();
		getSubStatus();
	}, []);
	useEffect(() => {
		if (count > 10000) {
			setOpenModal(true);
		}
	}, []);
	const getSubStatus = async () => {
		const res = await checkSubscriptionStatus();
		if (res?.status === "active") {
			setSubStatus("active");
		} else {
			setSubStatus("inactive");
		}
	};
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
		<CountContext.Provider
			value={{ count, getUsage, openModal, setOpenModal, subStatus }}
		>
			{children}
		</CountContext.Provider>
	);
};

export default UsageProvider;
