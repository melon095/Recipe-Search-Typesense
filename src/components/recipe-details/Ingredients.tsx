import { Ingredients as IngredientsType } from "@prisma/client";

type Props = {
	ingredients: IngredientsType[];
};

export default function Ingredients({ ingredients }: Props) {
	return (
		<ul>
			{ingredients.map((ingredient) => (
				<li key={ingredient.id} className="my-2">
					{ingredient.amount} {ingredient.unit} {ingredient.name}
				</li>
			))}
		</ul>
	);
}
