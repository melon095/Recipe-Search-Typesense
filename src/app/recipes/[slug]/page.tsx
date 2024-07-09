import RecipeTags from "@/components/recipe-details/RecipeTags";
import RecipeImage from "@/components/recipe/RecipeImage";
import Instructions from "@/components/recipe-details/Instructions";
import Ingredients from "@/components/recipe-details/Ingredients";
import { Prisma } from "@/lib/database";
import { RouteParams } from "@/types/page-params";
import { Authors } from "@prisma/client";

function RecipeTitle({ title }: { title: string }) {
	return <h1>{title}</h1>;
}

function RecipeAuthor({ author }: { author: Authors }) {
	return <h5 className="text-sm text-gray-500 my-1">By {author.name}</h5>;
}

export default async function _({ params }: RouteParams<{ slug: string }>) {
	const { slug } = params;

	const recipe = await Prisma.recipes.findUnique({
		where: {
			slug,
		},
		include: {
			author: true,
			ingredients: true,
			instructions: true,
			photo: true,
			tags: true,
		},
	});

	if (!recipe) {
		return {
			status: 404,
			body: "Recipe not found",
		};
	}

	return (
		<div className="grid grid-cols-3 grid-rows-2 gap-4 grid-flow-row-dense p-5 m-auto place-items-center">
			<div>
				<RecipeImage
					url={recipe.photo!.url!}
					alt={recipe.photo!.alt!}
				/>
			</div>
			<div className="col-span-2">
				<RecipeTitle title={recipe.name} />
				<RecipeAuthor author={recipe.author} />
				<RecipeTags tags={recipe.tags} />
			</div>
			<div>
				<Ingredients ingredients={recipe.ingredients} />
			</div>
			<div className="col-span-2">
				<Instructions instructions={recipe.instructions} />
			</div>
		</div>
	);
}
