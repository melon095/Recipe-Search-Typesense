import { PageParams, RouteParams } from "@/types/page-params";

export default function _({ params }: RouteParams<{ slug: string }>) {
	return (
		<>
			<div>
				This page displays a detailed overview about a recipe, including
				instructions and ingredients. The user wishes to see the recipe
				for
			</div>
			<div>{params.slug}.</div>
		</>
	);
}
