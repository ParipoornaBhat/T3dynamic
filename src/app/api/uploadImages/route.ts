import { NextRequest } from "next/server";
import { uploadToCloudinaryBOPP, deleteFromCloudinaryBOPP } from "@/lib/utils/cloudinary";

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const itemId = searchParams.get("itemId");

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
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const publicIds = body.publicIds as string[];

    if (!publicIds || !Array.isArray(publicIds) || publicIds.length === 0) {
      return new Response(JSON.stringify({ error: "Missing or invalid publicIds." }), {
        status: 400,
      });
    }

    const results = await Promise.all(
      publicIds.map(async (publicId) => {
        try {
          const res = await deleteFromCloudinaryBOPP(publicId);
          return { publicId, result: res?.result || "ok" };
        } catch (err) {
          return { publicId, error: "Failed to delete" };
        }
      })
    );

    return Response.json({ results });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid JSON body or server error." }), {
      status: 500,
    });
  }
}

