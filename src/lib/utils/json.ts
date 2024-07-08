import { CancelableRequest } from "got";
import fs from "node:fs/promises";
import { z } from "zod";

export async function gotResponseToJson<TResponse>(
	request: CancelableRequest,
	model: z.ZodType<TResponse>
) {
	const response = await request.json();
	return await model.parseAsync(response);
}

export async function readJsonFile<T>(path: string) {
	const content = await fs.readFile(path, "utf-8");

	return JSON.parse(content) as T;
}

export async function readJsonFileZod<T>(path: string, model: z.ZodType<T>) {
	const content = await fs.readFile(path, "utf-8");

	return await model.parseAsync(JSON.parse(content));
}
