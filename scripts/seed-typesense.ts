import client from "@/lib/typesense/client";
import { Authors, Ingredients, Recipes } from "@/lib/typesense/schemas/index";
import { Prisma } from "@/lib/database/index";

const schemas = [Recipes.create, Ingredients.create, Authors.create];

for (const schema of schemas) {
	try {
		console.log(`Creating collection: ${schema.name}`);

		await client.collections().create(schema);
	} catch (error) {
		console.error();
	}
}

const recipes = await Prisma.recipes.findMany({
	include: {
		ingredients: true,
		tags: true,
		author: true,
		photo: true,
	},
});

const authors = recipes.map((recipe) => recipe.author);
const ingredients = recipes.flatMap((recipe) => recipe.ingredients);

const authorsDocuments = authors.map((author) => ({
	...author,
	id: author.id,
}));

const ingredientsDocuments = ingredients.map((ingredient) => ({
	...ingredient,
	id: ingredient.id,
	recipe_id: ingredient.recipeId,
}));

const recipesDocuments = recipes.map((recipe) => ({
	...recipe,
	tags: recipe.tags.map((tag) => tag.tag),
	id: recipe.id,
	author_id: recipe.authorsId,
}));

client
	.collections(Recipes.name)
	.documents()
	.import(recipesDocuments, { action: "upsert" });

client
	.collections(Authors.name)
	.documents()
	.import(authorsDocuments, { action: "upsert" });

client
	.collections(Ingredients.name)
	.documents()
	.import(ingredientsDocuments, { action: "upsert" });
