import { Instructions as InstructionsType } from "@prisma/client";

type Props = {
	instructions: InstructionsType[];
};

export default function Instructions({ instructions }: Props) {
	return (
		<div>
			<h2 className="my-5">Instructions.</h2>
			<ol>
				{instructions.map((instruction) => (
					<li key={instruction.id} className="my-2">
						{instruction.stepNumber}. {instruction.instruction}
					</li>
				))}
			</ol>
		</div>
	);
}
