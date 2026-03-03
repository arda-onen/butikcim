const MIME_FROM_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

const ALLOWED_MIME_TYPES = new Set(Object.values(MIME_FROM_EXT));

function getExtension(fileName: string) {
  const parts = fileName.toLowerCase().split(".");
  return parts.length > 1 ? `.${parts.pop()}` : "";
}

function resolveMimeType(file: File) {
  if (file.type && ALLOWED_MIME_TYPES.has(file.type)) {
    return file.type;
  }
  const ext = getExtension(file.name || "");
  return MIME_FROM_EXT[ext] ?? null;
}

export async function toImageDataUrl(file: File): Promise<string | null> {
  const mimeType = resolveMimeType(file);
  if (!mimeType) {
    return null;
  }
  const bytes = await file.arrayBuffer();
  return `data:${mimeType};base64,${Buffer.from(bytes).toString("base64")}`;
}
