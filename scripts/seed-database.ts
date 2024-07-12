import { Prisma } from "@/lib/database/index.js";
import { generativeRecipe } from "@/lib/entities/recipe-entity";
import { readJsonFileZod } from "@/lib/utils/json";
import { getDirname } from "@/lib/utils/path";
import { slugIt } from "@/lib/utils/slug";
import path from "path";
import { z } from "zod";
import { faker } from "@faker-js/faker";
import { buckets, uploadS3 } from "@/lib/s3/index";

function createAuthor() {
	return {
		name: faker.person.fullName(),
		email: faker.internet.email(),
		age: faker.number.int({ min: 18, max: 100 }),
		location: faker.location.city(),
	};
}

const __dirname = getDirname(import.meta);

const recipes = await readJsonFileZod(
	path.resolve(__dirname, "../generative-data/data.json"),
	z.array(generativeRecipe)
);

const authors = Array.from({ length: 35 }, createAuthor);

for (const recipe of recipes) {
	console.log(recipe);

	const slug = slugIt(recipe.Name);

	const existingRecipe = await Prisma.recipes.findFirst({
		where: {
			slug,
		},
	});
	if (existingRecipe) {
		continue;
	}

	const tags = recipe.Tags.map((tag) => ({ tag: tag.toLowerCase().trim() }));

	const author = faker.helpers.arrayElement(authors);

	const prefixPath = "recipes/thumb";
	const photoPath = `generative-data/photos/${slug}.png`;
	const photoUrl = await uploadS3(prefixPath, photoPath);
	if (photoUrl === false) continue;

	await Prisma.$transaction([
		Prisma.recipes.create({
			data: {
				name: recipe.Name,
				slug,
				description: recipe.Description,
				timeEstimate: recipe.TimeEstimate,
				ingredients: {
					createMany: {
						data: recipe.Ingredients.map(
							({ Amount, Name, Unit }) => ({
								amount: Amount,
								name: Name,
								unit: Unit,
							})
						),
					},
				},
				instructions: {
					createMany: {
						data: recipe.Instructions.map((instruction, i) => ({
							stepNumber: i + 1,
							instruction: instruction,
						})),
					},
				},
				tags: {
					connectOrCreate: tags.map((tag) => ({
						where: tag,
						create: tag,
					})),
				},
				author: {
					connectOrCreate: {
						where: { email: author.email },
						create: author,
					},
				},
				photo: {
					create: {
						url: photoUrl,
						alt: recipe.Name,
					},
				},
			},
		}),
	]);
}
