declare namespace NodeJS {
  interface ProcessEnv extends Record<string, string | undefined> {
    TYPESENSE_HOST: string;
    TYPESENSE_PORT: number;
    TYPESENSE_PROTOCOL: string;
    TYPESENSE_API_KEY: string;

    MINIO_ENDPOINT: string;
    MINIO_PORT: string;
    MINIO_ACCESS_KEY: string;
    MINIO_SECRET_KEY: string;
  }
}
