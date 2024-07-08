import { Recipes } from "@/lib/typesense/schemas";
import Image from "next/image";
import Link from "next/link";
import clockIcon from "@public/stopwatch.svg";
import personIcon from "@public/person.svg";
import { SearchResponseHighlight } from "typesense/lib/Typesense/Documents";
import HighlightedText from "../HighlightedText";

// TODO: Blurred thumb?
const shimmer = (w: number, h: number) =>
	`<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

type Props = {
	recipe: Recipes.Schema;
	highlight?: SearchResponseHighlight<Recipes.Schema>;
};

const toBase64 = (data: string) =>
	typeof window === "undefined"
		? Buffer.from(data).toString("base64")
		: window.btoa(data);

export default function Recipe({ recipe, highlight }: Props) {
	const w = 256,
		h = 256;
	const encodedShimmer = toBase64(shimmer(w, h));
	const href = `/recipes/${recipe.slug}`;

	return (
		<>
			<a href={href}>
				<Image
					src={recipe.photo.url}
					alt={recipe.photo.alt}
					width={w}
					height={h}
					placeholder={`data:image/svg+xml;base64,${encodedShimmer}`}
				></Image>
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
