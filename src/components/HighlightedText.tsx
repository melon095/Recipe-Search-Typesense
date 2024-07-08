export type Props = {
	className?: string;
	text: string;
	tokens?: string[];
};

export default function HighlightedText({ className, text, tokens }: Props) {
	if (!tokens) {
		return <span className={className}>{text}</span>;
	}

	return (
		<span className={className}>
			{text.split(" ").map((word, index) => {
				const token = tokens.find((token) => token === word);

				if (token) {
					return (
						<span key={index}>
							<mark className="bg-yellow-200 dark:bg-yellow-700 dark:text-yellow-200">
								{word}
							</mark>{" "}
						</span>
					);
				}

				return <span key={index}>{word} </span>;
			})}
		</span>
	);
}
