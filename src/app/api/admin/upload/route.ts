import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { isCloudinaryConfigured, uploadToCloudinary } from "@/lib/cloudinary";

const UPLOAD_DIR = path.join(process.cwd(), "public/images/uploads");

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. If Cloudinary is configured, upload to Cloudinary cloud CDN
    if (isCloudinaryConfigured()) {
      try {
        const cloudResult = await uploadToCloudinary(buffer, file.name);
        return NextResponse.json({
          success: true,
          url: cloudResult.url,
          publicId: cloudResult.public_id,
          format: cloudResult.format,
          provider: "cloudinary",
        });
      } catch (cloudErr: any) {
        console.error("Cloudinary upload failed, attempting local fallback:", cloudErr);
      }
    }

    // 2. Local filesystem fallback
    try {
      if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
      }

      // Sanitize filename and prepend timestamp
      const cleanName = file.name
        .toLowerCase()
        .replace(/[^a-z0-9.]/g, "_")
        .replace(/_+/g, "_");
      const uniqueFilename = `${Date.now()}_${cleanName}`;
      const filePath = path.join(UPLOAD_DIR, uniqueFilename);

      fs.writeFileSync(filePath, buffer);

      const publicUrl = `/images/uploads/${uniqueFilename}`;

      return NextResponse.json({
        success: true,
        url: publicUrl,
        filename: uniqueFilename,
        size: buffer.length,
        provider: "local",
      });
    } catch (fsErr: any) {
      console.error("Local upload write error:", fsErr);
      return NextResponse.json(
        {
          error:
            "Image upload requires Cloudinary credentials in production serverless environments. Please configure Cloudinary in environment variables.",
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}
