import { CountContext } from "@/providers/UsageProvider";
import Link from "next/link";
import { useContext } from "react";

const CreditsUsageBar = () => {
	const ctx = useContext(CountContext);
	const credits = 10000;
	const percent =
		ctx?.subStatus === "active" ? 100 : (ctx?.count! / credits) * 100;
	return (
		<div>
			<p className="font-bold text-white">Credits usage</p>

			<div className="mt-3" aria-hidden="true">
				<div className="overflow-hidden rounded-full bg-gray-200">
					<div
						className="h-2 rounded-full bg-indigo-600"
						style={{ width: percent + "%" }}
					/>
				</div>
				<div className="mt-3 text-white font-semibold">
					<div>
						{ctx?.subStatus === "active" ? "Unlimited credits" : "usage"}
					</div>
				</div>
				{ctx?.subStatus ? null : (
					<Link
						href={"/membership"}
						className="hover:scale-105 block text-center transition-all ease-in-out bg-emerald-500 my-4 text-white w-full px-4 py-3 rounded-lg"
					>
						Upgrade
					</Link>
				)}
			</div>
		</div>
	);
};

export default CreditsUsageBar;
