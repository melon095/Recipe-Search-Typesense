import { Recipes } from "@/lib/typesense/schemas";
import { getQueryParamArray } from "@/lib/utils/search-params";
import { useEffect, useState } from "react";
import { SearchResponseFacetCountSchema } from "typesense/lib/Typesense/Documents";

type Props = {
	facets: SearchResponseFacetCountSchema<Recipes.Schema>[];
	params: URLSearchParams;
	onFacetChange: (facet: string, checked: boolean) => void;
	onSortOrderChange: (sortOrder: SortOrder) => void;
};

export default function FilterBox({
	facets,
	params,
	onFacetChange,
	onSortOrderChange,
}: Props) {
	const tagFacet = facets?.find((facet) => facet.field_name === "tags");
	const timeFacet = facets?.find(
		(facet) => facet.field_name === "timeEstimate"
	);

	const [checkedTags, setCheckedTags] = useState<string[]>([]);
	const [sortOrder, setSortOrder] = useState<SortOrder | undefined>();

	useEffect(() => {
		const tags = getQueryParamArray(params, "tags");
		setCheckedTags(tags);
	}, [params]);

	useEffect(() => {
		const sortOrder = params.get("sortOrder") as SortOrder;
		setSortOrder(sortOrder);
	}, [params]);

	return (
		<ul className="space-y-4">
			<li className="space-y-2">
				<dd className="font-bold">Filter by:</dd>
				<ul className="space-y-2">
					{tagFacet?.counts.map((tag) => Facet(tag))}
				</ul>
			</li>
			{/* <li>
				<TimeEstimate />
			</li> */}
			<li className="space-y-2">
				<SortOrder />
			</li>
		</ul>
	);

	function Facet(tag: { count: number; highlighted: string; value: string }) {
		return (
			<li key={tag.value}>
				<label>
					<input
						type="checkbox"
						name="tags"
						checked={checkedTags.includes(tag.value)}
						onChange={() => {
							onFacetChange(
								tag.value,
								!checkedTags.includes(tag.value)
							);
						}}
						className="mr-2"
					/>
					{tag.value} ({tag.count})
				</label>
			</li>
		);
	}

	function SortOrder() {
		return (
			<label>
				Sort Time Estimate By
				<select
					value={sortOrder ?? ""}
					onChange={(e) =>
						onSortOrderChange(e.target.value as SortOrder)
					}
					className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
				>
					<option value="asc">Ascending</option>
					<option value="desc">Descending</option>
				</select>
			</label>
		);
	}

	// function TimeEstimate() {
	// 	const DEFAULT_MAX = 300;

	// 	if (!timeFacet) {
	// 		return (
	// 			<label>
	// 				Time Estimate
	// 				<input
	// 					type="range"
	// 					min={0}
	// 					max={0}
	// 					value={0}
	// 					onChange={() => {}}
	// 				/>
	// 			</label>
	// 		);
	// 	}

	// 	return (
	// 		<label>
	// 			Time Estimate
	// 			<input
	// 				type="range"
	// 				min="10"
	// 				max={timeFacet.stats.max ?? DEFAULT_MAX}
	// 				value={params.get("timeEstimate") ?? "10"}
	// 				onChange={(e) =>
	// 					onTimeEstimateChange(Number(e.target.value))
	// 				}
	// 			/>
	// 		</label>
	// 	);
	// }
}
