import path from "node:path";
import { fileURLToPath } from "node:url";

export const getDirname = (meta: ImportMeta) =>
	path.dirname(fileURLToPath(meta.url));
