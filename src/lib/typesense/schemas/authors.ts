import { CollectionCreateSchema } from "typesense/lib/Typesense/Collections";

export const name = "authors";
export const create: CollectionCreateSchema = {
  name,
  fields: [
    { name: "id", type: "string" },
    { name: "name", type: "string" },
    { name: "location", type: "string" },
    { name: "age", type: "int32" },
  ],
};

export interface Schema {
  age: number;
  email: string;
  id: string;
  location: string;
  name: string;
}
