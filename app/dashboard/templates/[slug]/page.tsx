import Templates from "@/lib/constants";
interface Template {
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
	const template = Templates.find((t) => t.slug === slug) as Template;
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-5 px-5">
			<div className="col-span-1 rounded-md shadow-lg border p-4">
				template form
				<form>
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
									required={field.required}
									className="w-full border shadow-lg outline-none text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 p-2"
								/>
							) : (
								<textarea
									rows={4}
									className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									defaultValue={""}
								/>
							)}
						</div>
					))}
				</form>
			</div>
		</div>
	);
};

export default TemplatePage;
