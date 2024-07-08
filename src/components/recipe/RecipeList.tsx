import { Recipes } from "@/lib/typesense/schemas";
import Recipe from "./Recipe";
import { SearchResponse } from "typesense/lib/Typesense/Documents";

type Props = {
	recipes: SearchResponse<Recipes.Schema>;
};

export default function RecipeList({ recipes }: Props) {
	return (
		<ul className="pt-4 list-none grid grid-cols-3 grid-rows-4 gap-4 grid-flow-row sm:grid-cols-2">
			{recipes.hits?.map((recipe) => {
				return (
					<li key={recipe.document.id} className="w-auto">
						<Recipe
							recipe={recipe.document}
							highlight={recipe.highlight}
						/>
					</li>
				);
			})}
		</ul>
	);
}
