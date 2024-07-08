import RecipeContainer from "@/components/recipe/RecipeContainer";
import { MAX_RECIPE_PER_PAGE } from "@/lib/constants";
import { searchRecipes } from "@/lib/typesense";
import { TypesenseSearchBuilder } from "@/lib/typesense/typesense-search-builder";
import { PageParams } from "@/types/page-params";
import { Suspense } from "react";

const validSortOrder = (sortOrder: string): sortOrder is SortOrder =>
	["asc", "desc"].includes(sortOrder);

const defaultSearchParams = {
	per_page: MAX_RECIPE_PER_PAGE,
	exhaustive_search: true,
	facet_by: "tags,timeEstimate",
};

export default async function _({ searchParams }: PageParams) {
	const builder = new TypesenseSearchBuilder(defaultSearchParams)
		.q(searchParams.search ?? "*")
		.queryBy("name", "description", "author.name");

	if (searchParams.page) {
		const page = ~~searchParams.page ?? 1;

		builder.set("page", page);
	}

	if (searchParams.tags) {
		searchParams.tags.split(",").forEach((tag) => {
			builder.filterBy("tags", (ctx) => ctx.Exact(tag));
		});
	}

	if (searchParams.sortOrder && validSortOrder(searchParams.sortOrder)) {
		builder.sortBy("timeEstimate", searchParams.sortOrder);
	}

	const query = builder.build();

	console.log("Making Typesense query", { query });

	const recipes = await searchRecipes(query);

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<RecipeContainer recipes={recipes} />
		</Suspense>
	);
}
