import Card from "@/components/Card";
import templates from "@/lib/constants";

const DashboardPage = () => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{templates.map((template) => (
				<Card template={template} key={template.slug} />
			))}
		</div>
	);
};

export default DashboardPage;
