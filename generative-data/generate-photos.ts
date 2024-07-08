import fs from "node:fs/promises";
import Got from "got";
import { generativeRecipe } from "@/lib/entities/recipe-entity.js";
import { gotResponseToJson, readJsonFileZod } from "@/lib/utils/json";
import { z } from "zod";
import { getDirname } from "@/lib/utils/path";
import path from "node:path";
import { slugIt } from "@/lib/utils/slug";

const Txt2ImgResponse = z.object({
	images: z.array(z.string()),
});

const __dirname = getDirname(import.meta);
const webuiServerUrl = process.env.WEBUI_SERVER_URL || "http://localhost:3000";
const diffusionModel = "sd_xl_base_1.0";

const outDir = path.resolve(__dirname, "./photos");

const readLocalFile = (file: string) =>
	fs.readFile(path.resolve(__dirname, file), "utf-8");

const fileExists = async (file: string) =>
	fs
		.stat(file)
		.then(() => true)
		.catch(() => false);

const recipes = await readJsonFileZod(
	path.resolve(__dirname, "./data.json"),
	z.array(generativeRecipe)
);

const generativeInstructions = {
	seed: -1,
	steps: 50,
	cfg_scale: 8,
	width: 1024,
	height: 1024,
	send_images: true,
	save_images: false,
	model: diffusionModel,
	prompt: await readLocalFile("./DIFFUSION-POSITIVE.txt"),
	negative_prompt: await readLocalFile("./DIFFUSION-NEGATIVE.txt"),
};

const http = Got.extend({
	prefixUrl: webuiServerUrl,
	responseType: "json",
});

if (!(await fileExists(outDir))) {
	console.log(`Creating directory ${outDir}`);

	await fs.mkdir(outDir);
}

for (const recipe of recipes) {
	const outPath = path.resolve(outDir, slugIt(recipe.Name)) + ".png";
	if (await fileExists(outPath)) {
		console.log(`Skipping ${recipe.Name}, already exists at ${outPath}`);
		continue;
	}

	console.log(`Generating photo for recipe ${recipe.Name}`);

	const json = generativeInstructions;
	json.prompt = `${recipe.SDXLPrompt}, ${json.prompt}`;

	const response = http.post("sdapi/v1/txt2img", {
		json,
	});

	const { images } = await gotResponseToJson(response, Txt2ImgResponse);

	const buffer = Buffer.from(images[0], "base64");

	await fs.writeFile(outPath, buffer);

	console.log(`Generated ${recipe.Name} and saved to ${outPath}`);
}
