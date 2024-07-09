import { Recipes } from "@/lib/typesense/schemas";
import Link from "next/link";
import clockIcon from "@public/stopwatch.svg";
import personIcon from "@public/person.svg";
import { SearchResponseHighlight } from "typesense/lib/Typesense/Documents";
import HighlightedText from "../HighlightedText";
import RecipeImage from "./RecipeImage";
import Image from "next/image";

type Props = {
	recipe: Recipes.Schema;
	highlight?: SearchResponseHighlight<Recipes.Schema>;
};

export default function Recipe({ recipe, highlight }: Props) {
	const href = `/recipes/${recipe.slug}`;

	return (
		<>
			<a href={href}>
				<RecipeImage url={recipe.photo.url} alt={recipe.photo.alt} />
			</a>
			<h4>
				<HighlightedText
					text={recipe.name}
					tokens={highlight?.name?.matched_tokens}
				/>
			</h4>
			<p>
				<Image
					className="inline-block dark:filter dark:invert"
					src={clockIcon}
					alt="clock"
				/>
				<span className="pl-1">{recipe.timeEstimate} minutes</span>
			</p>
			<p>
				<Image
					className="inline-block dark:filter dark:invert"
					src={personIcon}
					alt="person"
				/>
				<HighlightedText
					className="pl-1"
					text={recipe.author.name}
					tokens={highlight?.author?.name?.matched_tokens}
				/>
			</p>

			<Link href={href}>
				<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
					View
				</button>
			</Link>
		</>
	);
}
