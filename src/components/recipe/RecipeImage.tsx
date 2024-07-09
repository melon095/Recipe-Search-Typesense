import Image from "next/image";

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

const toBase64 = (data: string) =>
	typeof window === "undefined"
		? Buffer.from(data).toString("base64")
		: window.btoa(data);

type Props = {
	url: string;
	alt: string;
};

export default function RecipeImage({ url, alt }: Props) {
	const w = 256,
		h = 256;
	const encodedShimmer = toBase64(shimmer(w, h));

	return (
		<Image
			src={url}
			alt={alt}
			width={w}
			height={h}
			placeholder={`data:image/svg+xml;base64,${encodedShimmer}`}
		/>
	);
}
