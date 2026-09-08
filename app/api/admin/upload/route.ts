import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export async function POST(request: Request) {
  try {
    await assertAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  const folder = String(form?.get("folder") ?? "misc").replace(/[^a-z0-9/_-]/gi, "");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, WebP or AVIF images are allowed" },
      { status: 415 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Image is larger than 8 MB" },
      { status: 413 },
    );
  }

  // Guard against a spoofed MIME by sniffing magic bytes.
  const head = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const okMagic =
    (head[0] === 0xff && head[1] === 0xd8) || // jpg
    (head[0] === 0x89 && head[1] === 0x50) || // png
    (head[8] === 0x57 && head[9] === 0x45 && head[10] === 0x42) || // WEBP
    (head[4] === 0x66 && head[5] === 0x74 && head[6] === 0x79 && head[7] === 0x70); // ftyp (avif)
  if (!okMagic) {
    return NextResponse.json({ error: "File is not a valid image" }, { status: 415 });
  }

  const supabase = await createSupabaseServerClient();
  const ext = EXT[file.type];
  const path = `${folder || "misc"}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("media")
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("media").getPublicUrl(path);

  return NextResponse.json({ url: publicUrl, path });
}
