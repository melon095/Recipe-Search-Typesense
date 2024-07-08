export const slugIt = (str: string) =>
	str
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+/, "")
		.replace(/-+$/, "");
