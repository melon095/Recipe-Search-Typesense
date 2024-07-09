import { Tags } from "@prisma/client";
import Link from "next/link";

type Props = {
	tags: Tags[];
};

export default function RecipeTags({ tags }: Props) {
	return (
		<ul className="list-none">
			{tags.map((tag) => (
				<Link
					key={tag.id}
					href={`/recipes?tags=${tag.tag}`}
					target="_blank"
				>
					<li className="inline-block border border-blue-400 bg-blue-200 rounded-full px-3 py-1 text-sm font-semibold text-blue-700 mr-2 my-2">
						{tag.tag}
					</li>
				</Link>
			))}
		</ul>
	);
}
