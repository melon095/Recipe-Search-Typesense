import * as Minio from "minio";
import path from "path";

const metadata = {
	"Content-Type": "image/png",
};

const { url, port, useSSL } = parse(process.env.MINIO_ENDPOINT);

export const minioClient = new Minio.Client({
	endPoint: url.hostname,
	port,
	accessKey: process.env.MINIO_ACCESS_KEY,
	secretKey: process.env.MINIO_SECRET_KEY,
	useSSL,
});

export const buckets = {
	recipePhotos: "recipe-search-typesense",
};

/**
 * @param prefixPath - Prefix path in MiniO bucket
 * @param filePath - Path to file to upload
 */
export const uploadS3 = async (prefixPath: string, filePath: string) => {
	const fileName = path.basename(filePath);

	try {
		await minioClient.fPutObject(
			buckets.recipePhotos,
			`${prefixPath}/${fileName}`,
			filePath,
			metadata
		);
	} catch (error) {
		console.error("Failed to upload file to Minio", error);

		return false;
	}

	return buildFQDN(buckets.recipePhotos, `${prefixPath}/${fileName}`);
};

const buildFQDN = (bucket: string, path: string) => {
	const _url = new URL(url);

	if (useSSL) _url.protocol = "https:";

	if (process.env.MINIO_PORT) _url.port = process.env.MINIO_PORT;

	_url.pathname = `${bucket}/${path}`;

	return _url.toString();
};

function parse(endpoint: string) {
	const asUrl = new URL(endpoint);
	const useSSL = asUrl.protocol === "https:";
	const port = process.env.MINIO_PORT
		? parseInt(process.env.MINIO_PORT)
		: undefined;

	return {
		url: asUrl,
		port,
		useSSL,
	};
}
