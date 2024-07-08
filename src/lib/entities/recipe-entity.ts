import z from "zod";

export const measurementUnit = z.enum([
	"g",
	"kg",
	"ml",
	"l",
	"tsp",
	"tbsp",
	"pinch",
]);
export type MeasurementUnit = z.infer<typeof measurementUnit>;

export const generativeIngredient = z.object({
	Amount: z.string(),
	Unit: measurementUnit.or(z.string()),
	Name: z.string(),
});
export type GenerativeIngredient = z.infer<typeof generativeIngredient>;

export const generativeRecipe = z.object({
	Name: z.string(),
	Description: z.string(),
	Ingredients: z.array(generativeIngredient),
	Instructions: z.array(z.string()),
	Tags: z.array(z.string()),
	TimeEstimate: z.number(),
	SDXLPrompt: z.string(),
});
export type GenerativeRecipe = z.infer<typeof generativeRecipe>;
