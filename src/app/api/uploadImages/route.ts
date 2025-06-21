import { NextRequest } from "next/server";
import { uploadToCloudinaryBOPP } from "@/lib/utils/cloudinary";

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const itemId = searchParams.get("itemId"); // get itemId from query param

  const formData = await req.formData();
  const files = formData.getAll("images") as File[];

  if (!files || files.length === 0 || !itemId) {
    return new Response(JSON.stringify({ error: "Missing files or itemId." }), {
      status: 400,
    });
  }

  const urls = await Promise.all(
    files.map(async (file, idx) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const customName = `${itemId}-${String(idx + 1).padStart(2, "0")}`;
      const uploaded = await uploadToCloudinaryBOPP(buffer, customName);

      return uploaded.secure_url;
    })
  );

  return Response.json({ urls });
}
