import * as Minio from "minio";
import path from "path";

const metadata = {
  "Content-Type": "image/png",
};

export const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: parseInt(process.env.MINIO_PORT),
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
  useSSL: false,
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
  const url = new URL(`http://${process.env.MINIO_ENDPOINT}`);

  if (process.env.MINIO_PORT) url.port = process.env.MINIO_PORT;

  url.pathname = `${bucket}/${path}`;

  return url.toString();
};
