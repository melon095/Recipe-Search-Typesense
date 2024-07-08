"use client";

import { useCallback } from "react";
import SearchBox from "./SearchBox";
import FilterBox from "./FilterBox";
import RecipeList from "./RecipeList";
import Pagination from "./Pagination";
import { Recipes } from "@/lib/typesense/schemas";
import { SearchResponse } from "typesense/lib/Typesense/Documents";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { getQueryParamArray } from "@/lib/utils/search-params";
import { MAX_RECIPE_PER_PAGE } from "@/lib/constants";

const qTags = "tags";
const qSearch = "search";
const qSortOrder = "sortOrder";
const qPage = "page";

interface Props {
	recipes: SearchResponse<Recipes.Schema>;
}

export default function RecipeContainer({ recipes }: Props) {
	const router = useRouter(),
		pathname = usePathname(),
		searchParams = useSearchParams();

	const createRouterPath = useCallback(
		(key: string, value: unknown) => {
			const newParams = new URLSearchParams(searchParams);

			if (value) {
				newParams.set(key, value.toString());
			} else {
				newParams.delete(key);
			}

			return `${pathname}?${newParams.toString()}`;
		},
		[pathname, searchParams]
	);

	const getPageFilter = useCallback(() => {
		const mutatableParams = new URLSearchParams(searchParams);

		return parseInt(mutatableParams.get(qPage) ?? "1");
	}, [searchParams]);

	const onSearch = (search: string) =>
		router.push(createRouterPath(qSearch, search));

	const onFacetChange = (facet: string, checked: boolean) => {
		const mutatableParams = new URLSearchParams(searchParams);
		const tags = getQueryParamArray(mutatableParams, qTags);

		if (checked) {
			tags.push(facet);
		} else {
			tags.splice(tags.indexOf(facet), 1);
		}

		router.push(createRouterPath(qTags, tags.join(",")));
	};

	const onSortOrder = (sortOrder: SortOrder) =>
		router.push(createRouterPath(qSortOrder, sortOrder));

	const onPrevious = () => {
		const page = getPageFilter();

		if (page > 1) {
			router.push(createRouterPath(qPage, page - 1));
		}
	};

	const onNext = () => {
		const page = getPageFilter();
		const maxPage = Math.ceil(
			recipes.found /
				(recipes.request_params.per_page ?? MAX_RECIPE_PER_PAGE)
		);

		if (page < maxPage) {
			router.push(createRouterPath(qPage, page + 1));
		}
	};

	return (
		<div className="container flex flex-row justify-center mx-auto pb-10">
			<div>
				<FilterBox
					facets={recipes.facet_counts ?? []}
					params={searchParams}
					onFacetChange={onFacetChange}
					onSortOrderChange={onSortOrder}
				/>
			</div>
			<div className="pl-4">
				<SearchBox
					search={searchParams.get("search") ?? ""}
					onSearch={onSearch}
				/>
				<Pagination
					recipes={recipes}
					onPrevious={onPrevious}
					onNext={onNext}
				/>
				<RecipeList recipes={recipes} />
			</div>
		</div>
	);
}
