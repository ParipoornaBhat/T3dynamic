import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});
export const uploadToCloudinaryBOPP = (
  buffer: Buffer,
  publicId: string
): Promise<{ secure_url: string }> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "bopp-items",
        public_id: publicId, // <-- use full name here directly
      },
      (err, result) => {
        if (err || !result) return reject(err);
        resolve({ secure_url: result.secure_url });
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

