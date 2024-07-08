import { CollectionCreateSchema } from "typesense/lib/Typesense/Collections";

export const name = "ingredients";
export const create: CollectionCreateSchema = {
  name,
  fields: [
    { name: "id", type: "string" },
    { name: "amount", type: "string" },
    { name: "unit", type: "string" },
    { name: "name", type: "string", facet: true },
    { name: "recipe_id", type: "string", references: "recipes.id" },
  ],
};

export interface Schema {
  amount: string;
  id: string;
  name: string;
  recipeId: string;
  unit: string;
}
