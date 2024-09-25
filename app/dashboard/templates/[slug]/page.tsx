"use client";
import { generateText, saveQuery } from "@/lib/actions/actions";
import Templates from "@/lib/constants";
import Image from "next/image";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/16/solid";
import { useSession } from "next-auth/react";
import MarkdownEditor from "@uiw/react-markdown-editor";
export interface Template {
	name: string;
	desc: string;
	category: string;
	icon: string;
	aiPrompt: string;
	slug: string;
	form: {
		label: string;
		field: string;
		name: string;
		required: boolean;
	}[];
}
interface Props {
	params: {
		slug: string;
	};
}
const TemplatePage = ({ params: { slug } }: Props) => {
	const [query, setQuery] = useState("");
	const [aiConent, setAiContent] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { data } = useSession();
	const template = Templates.find((t) => t.slug === slug) as Template;
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			setIsLoading(true);
			const res = await generateText(template.aiPrompt + query);
			setAiContent(res.data);
			await saveQuery({
				template,
				content: res.data,
				email: data?.user?.email!,
				query,
			});
		} catch (error) {
			setAiContent("Something went wrong. Please try again later.");
		} finally {
			setIsLoading(false);
			console.log(aiConent);
		}
	};

	return (
		<div className="flex flex-col items-start">
			<Link
				href={"/dashboard"}
				className=" bg-emerald-500 gap-2 transition-all ease-in-out flex items-center my-4 text-white px-8 hover:scale-105 py-3 rounded-lg"
			>
				<ArrowLeftIcon className="w-5 h-5" />
				<span>Back</span>
			</Link>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-5 px-5">
				<div className="col-span-1 rounded-md shadow-lg border p-4">
					<div className="flex flex-col gap-4">
						<Image
							src={template.icon}
							alt={template.name}
							width={50}
							height={50}
						/>
						<h2 className="font-medium text-lg">{template.name}</h2>
						<p className="text-gray-400">{template.desc}</p>
					</div>
					<form onSubmit={handleSubmit}>
						{template.form.map((field) => (
							<div key={field.label} className="my-2 flex flex-col">
								<label className="font-medium pb-5" key={field.label}>
									{field.label}
								</label>
								{field.field === "input" ? (
									<input
										type="text"
										name={field.name}
										placeholder={field.name}
										onChange={(e) => setQuery(e.target.value)}
										value={query}
										required={field.required}
										className="w-full border shadow-md outline-none text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 p-2"
									/>
								) : (
									<textarea
										rows={4}
										value={query}
										onChange={(e) => setQuery(e.target.value)}
										className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
										defaultValue={""}
									/>
								)}
							</div>
						))}
						<button
							className="disabled:cursor-wait bg-emerald-500 my-4 text-white w-full px-4 py-3 rounded-lg"
							type="submit"
						>
							{isLoading ? "Generating..." : "Generate"}
						</button>
					</form>
				</div>
				<div className="col-span-2">
					<MarkdownEditor
						value={aiConent}
						height="400px"
						defaultValue={"Ai generated content display here..."}
					/>
				</div>
			</div>
		</div>
	);
};

export default TemplatePage;
