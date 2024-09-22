import Image from "next/image";

interface Props {
	template: {
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
	};
}
export default function Card({ template }: Props) {
	return (
		<div className="dark:bg-black overflow-hidden rounded-lg bg-white shadow hover:bg-gray-200 transition-all ease-in-out hover:cursor-pointer">
			<div className="px-4 py-3 sm:px-6 flex flex-col items-center">
				<Image src={template.icon} alt="icon" width={50} height={50} />
				<h2 className="font-medium text-lg pt-3">{template.name}</h2>
			</div>
			<div className="px-4 py-3 sm:px-6">
				<p className="text-gray-400">{template.desc}</p>
			</div>
		</div>
	);
}
