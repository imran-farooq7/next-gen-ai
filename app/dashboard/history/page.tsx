import { getAllQueries } from "@/lib/actions/actions";
const HistoryPage = async () => {
	const queries = await getAllQueries();
	return (
		<div className="p-10 my-5 mx-5 mb-5 rounded-lg dark:bg-gray-900 flex flex-col justify-center items-center">
			<h1 className="text-xl font-bold">Histroy</h1>
			<p>Your search history</p>
		</div>
	);
};

export default HistoryPage;
