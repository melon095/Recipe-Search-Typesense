import { MAX_RECIPE_PER_PAGE } from "@/lib/constants";
import { Recipes } from "@/lib/typesense/schemas";
import { SearchResponse } from "typesense/lib/Typesense/Documents";

type Props = {
	recipes: SearchResponse<Recipes.Schema>;
	onPrevious: () => void;
	onNext: () => void;
};

export default function Pagination({ recipes, onPrevious, onNext }: Props) {
	const page = recipes.page ?? 1;
	const perPage = recipes.request_params.per_page ?? MAX_RECIPE_PER_PAGE;

	const startItem = (page - 1) * perPage + 1;
	const endItem = Math.min(page * perPage, recipes.found);

	return (
		<div className="flex flex-row justify-between">
			<p className="pt-4">
				Displaying recipes {startItem}-{endItem} of {recipes.found}
			</p>
			<div className="pt-4 space-x-4">
				<button
					className="bg-gray-300 hover:bg-gray-400 rounded-md px-4 py-2"
					onClick={onPrevious}
				>
					Previous
				</button>
				<button
					className="bg-gray-300 hover:bg-gray-400 rounded-md px-4 py-2"
					onClick={onNext}
				>
					Next
				</button>
			</div>
		</div>
	);
}
