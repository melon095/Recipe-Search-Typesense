import { SearchParams } from "typesense/lib/Typesense/Documents";
import { Recipes } from "./schemas/index";

export async function searchRecipes(data: SearchParams) {
	return await Recipes.documents().search(data);
}
