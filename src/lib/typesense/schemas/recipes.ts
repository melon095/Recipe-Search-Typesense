import { CollectionCreateSchema } from "typesense/lib/Typesense/Collections";
import client from "../client";
import { Authors, Ingredients } from ".";

export const name = "recipes";
export const create: CollectionCreateSchema = {
	name,
	fields: [
		{ name: "id", type: "string" },
		{ name: "name", type: "string", index: true },
		{ name: "slug", type: "string", index: true },
		{ name: "timeEstimate", type: "int32", facet: true },
		{ name: "description", type: "string", index: true },
		{ name: "tags", type: "string[]", facet: true },
		{ name: "photo", type: "object" },
		{ name: "author", type: "object" },
		{ name: "author.name", type: "string", index: true },
		{ name: "author_id", type: "string", references: "authors.id" },
	],
	enable_nested_fields: true,
};

export interface Schema {
	author: Authors.Schema;
	description: string;
	id: string;
	ingredients: Ingredients.Schema[];
	name: string;
	slug: string;
	photo: {
		url: string;
		alt: string;
	};
	tags: string[];
	timeEstimate: number;
}

export const documents = () => client.collections<Schema>(name).documents();
