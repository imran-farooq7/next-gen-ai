import HistoryTable from "@/components/HistoryTable";
import { getAllQueries } from "@/lib/actions/actions";
const HistoryPage = async () => {
	const queries = await getAllQueries();
	return (
		<div className="p-10 my-5 mx-5 mb-5 rounded-lg dark:bg-gray-900">
			<h1 className="text-2xl font-bold text-center text-emerald-500">
				Histroy
			</h1>
			<p className="text-center">Your search history</p>
			<HistoryTable query={queries.data!} />
		</div>
	);
};

export default HistoryPage;
