import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

let isConfigured = false;

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

function initCloudinary() {
  if (!isConfigured && isCloudinaryConfigured()) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
    isConfigured = true;
  }
}

export async function uploadToCloudinary(
  buffer: Buffer,
  filename: string,
  folder = "avoroni/uploads"
): Promise<{ url: string; public_id: string; format: string }> {
  initCloudinary();

  return new Promise((resolve, reject) => {
    // Strip extension from public_id suggestion
    const cleanId = filename.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: `${Date.now()}_${cleanId}`,
        resource_type: "auto",
        transformation: [{ quality: "auto:good", fetch_format: "auto" }],
      },
      (error, result: UploadApiResponse | undefined) => {
        if (error || !result) {
          return reject(error || new Error("Failed to upload to Cloudinary"));
        }
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
        });
      }
    );

    uploadStream.end(buffer);
  });
}
