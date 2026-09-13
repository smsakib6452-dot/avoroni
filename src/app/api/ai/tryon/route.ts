import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import fs from "fs";
import path from "path";

// Robust buffer resolution supporting Base64, Data URLs, local file paths, and remote URLs
async function resolveImageBuffer(imageInput: string): Promise<Buffer> {
  if (!imageInput) {
    const defaultPath = path.join(process.cwd(), "public", "images", "contact_intro.jpg");
    return fs.readFileSync(defaultPath);
  }

  // 1. Data URL (data:image/...;base64,...)
  if (imageInput.startsWith("data:")) {
    const commaIdx = imageInput.indexOf(",");
    const base64Data = commaIdx !== -1 ? imageInput.slice(commaIdx + 1) : imageInput;
    return Buffer.from(base64Data, "base64");
  }

  // 2. Local public file path (e.g., /images/contact_intro.jpg)
  if (imageInput.startsWith("/") || imageInput.startsWith("images/")) {
    const cleanPath = imageInput.startsWith("/") ? imageInput.slice(1) : imageInput;
    const fullPath = path.join(process.cwd(), "public", cleanPath);
    if (fs.existsSync(fullPath)) {
      return fs.readFileSync(fullPath);
    }
  }

  // 3. Remote URL (http / https)
  if (imageInput.startsWith("http://") || imageInput.startsWith("https://")) {
    const res = await fetch(imageInput);
    return Buffer.from(await res.arrayBuffer());
  }

  // 4. Raw base64 fallback
  try {
    const rawBuf = Buffer.from(imageInput, "base64");
    if (rawBuf.length > 500) {
      return rawBuf;
    }
  } catch (e) {
    // ignore
  }

  // Fallback to default model image
  const defaultPath = path.join(process.cwd(), "public", "images", "contact_intro.jpg");
  return fs.readFileSync(defaultPath);
}

function getLoc(val: any, lang: "bn" | "en" = "bn"): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  return val[lang] || val.en || "";
}

// Neural Virtual Try-On Engine (IDM-VTON & Leffa via HuggingFace ZeroGPU)
async function runNeuralTryOn(
  userBuffer: Buffer,
  garmentPath: string,
  productName: string
): Promise<{ buffer: Buffer; engine: string } | null> {
  const hfToken = process.env.HUGGINGFACE_TOKEN || process.env.HF_TOKEN;

  try {
    const { Client } = await import("@gradio/client");
    const clientOptions = hfToken ? { hf_token: hfToken as `hf_${string}` } : {};

    // 1. Try franciszzj/Leffa
    try {
      console.log("Connecting to Leffa Neural Virtual Try-On...");
      const client = await Client.connect("franciszzj/Leffa", clientOptions);
      const userBlob = new Blob([userBuffer as any], { type: "image/jpeg" });
      const garmBuf = fs.readFileSync(garmentPath);
      const garmBlob = new Blob([garmBuf as any], { type: "image/jpeg" });

      const result: any = await client.predict("/leffa_predict_vt", [
        userBlob,
        garmBlob,
        false,
        30,
        2.5,
        42,
        "viton_hd",
        "dresses",
        false,
      ]);

      const candidate = result?.data?.[0]?.url || result?.data?.[0]?.path;
      if (candidate) {
        const res = await fetch(candidate);
        const buf = Buffer.from(await res.arrayBuffer());
        console.log("Leffa synthesis successful!");
        return { buffer: buf, engine: "Leffa Neural Diffusion AI" };
      }
    } catch (e: any) {
      console.warn("Leffa attempt notice:", e.message);
    }

    // 2. Try yisol/IDM-VTON
    try {
      console.log("Connecting to IDM-VTON Neural Virtual Try-On...");
      const idmClient = await Client.connect("yisol/IDM-VTON", clientOptions);
      const userBlob = new Blob([userBuffer as any], { type: "image/jpeg" });
      const garmBuf = fs.readFileSync(garmentPath);
      const garmBlob = new Blob([garmBuf as any], { type: "image/jpeg" });

      const idmResult: any = await idmClient.predict("/tryon", [
        { background: userBlob, layers: [], composite: null },
        garmBlob,
        `Luxurious traditional South Asian ${productName} saree with intricate gold zari brocade`,
        true,
        false,
        25,
        42,
      ]);

      const candidate = idmResult?.data?.[0]?.url || idmResult?.data?.[0]?.path;
      if (candidate) {
        const res = await fetch(candidate);
        const buf = Buffer.from(await res.arrayBuffer());
        console.log("IDM-VTON synthesis successful!");
        return { buffer: buf, engine: "IDM-VTON Neural Diffusion AI" };
      }
    } catch (e: any) {
      console.warn("IDM-VTON attempt notice:", e.message);
    }
  } catch (err: any) {
    console.warn("Neural try-on general notice:", err.message);
  }

  return null;
}

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userImage, product, sourceMode = "camera", customFit } = body;

    if (!product) {
      return NextResponse.json(
        { error: "Missing required fields: product" },
        { status: 400 }
      );
    }

    const publicDir = path.join(process.cwd(), "public");
    const category = product.category || "saree";
    const productNameBn = getLoc(product.name, "bn") || "সিগনেচার কালেকশন";
    const productNameEn = getLoc(product.name, "en") || "Signature Heritage Drape";

    // 1. Resolve exact garment image path
    let garmentPath = path.join(publicDir, "images", "colorways", "jamdani_red.jpg");
    if (product.image) {
      const cleanImgPath = product.image.startsWith("/") ? product.image.slice(1) : product.image;
      const candidatePath = path.join(publicDir, cleanImgPath);
      if (fs.existsSync(candidatePath)) {
        garmentPath = candidatePath;
      }
    }

    // Standard 3:4 portrait dimensions
    const width = 896;
    const height = 1200;

    // Prepare Luxury Avoroni Dhaka Watermark Function
    const addLuxuryWatermark = async (imageBuffer: Buffer): Promise<Buffer> => {
      const meta = await sharp(imageBuffer).metadata();
      const w = meta.width || width;
      const h = meta.height || height;

      const watermarkSvg = `
        <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bottomShadow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#000000" stop-opacity="0" />
              <stop offset="45%" stop-color="#080606" stop-opacity="0.68" />
              <stop offset="100%" stop-color="#080606" stop-opacity="0.94" />
            </linearGradient>
          </defs>
          <rect x="0" y="${h - 130}" width="${w}" height="130" fill="url(#bottomShadow)" />
          
          <text x="45" y="${h - 70}" font-family="'Times New Roman', Georgia, serif" font-size="22" fill="#F5F0E8" letter-spacing="6" font-weight="bold">AVORONI DHAKA</text>
          <text x="45" y="${h - 42}" font-family="system-ui, -apple-system, sans-serif" font-size="13" fill="#C5A869" letter-spacing="2" font-weight="600">AI VIRTUAL ATELIER • ${productNameBn}</text>
          
          <circle cx="${w - 65}" cy="${h - 56}" r="24" fill="#4A151E" stroke="#C5A869" stroke-width="2" />
          <circle cx="${w - 65}" cy="${h - 56}" r="20" fill="none" stroke="#C5A869" stroke-width="1" stroke-dasharray="3,3" />
          <text x="${w - 65}" y="${h - 50}" font-family="sans-serif" font-size="16" fill="#FFF0A0" text-anchor="middle">✨</text>
        </svg>
      `;

      return await sharp(imageBuffer)
        .resize(w, h, { fit: "cover" })
        .composite([{ input: Buffer.from(watermarkSvg), top: 0, left: 0, blend: "over" }])
        .jpeg({ quality: 92 })
        .toBuffer();
    };

    // Determine if this is a Demo Model request
    const isDemoModel =
      sourceMode === "model" ||
      !userImage ||
      userImage === "/images/contact_intro.jpg" ||
      userImage.includes("colorways") ||
      userImage.includes("wardrobe") ||
      userImage.includes("editorial");

    // 2. DEMO MODEL SHOWCASE: 100% Crystal-Clear, Untouched Face & Master Saree
    if (isDemoModel) {
      let showcaseBuffer: Buffer;
      if (category === "saree") {
        showcaseBuffer = fs.readFileSync(garmentPath);
      } else if (category === "jewelry") {
        const jewelMap: Record<string, string> = {
          "v-jewel-1": "lifestyle/jewel_kundan_choker.jpg",
          "v-jewel-2": "lifestyle/jewel_chandbali_jhumka.jpg",
          "v-jewel-3": "lifestyle/jewel_chandrahaar_pendant.jpg",
        };
        const jFile = jewelMap[product.id] || "lifestyle/jewelry_cover.jpg";
        showcaseBuffer = fs.readFileSync(path.join(publicDir, "images", jFile));
      } else if (category === "shawl") {
        showcaseBuffer = fs.readFileSync(path.join(publicDir, "images", "lifestyle", "shawls_cover.jpg"));
      } else if (category === "clutch") {
        showcaseBuffer = fs.readFileSync(path.join(publicDir, "images", "lifestyle", "clutches_cover.jpg"));
      } else {
        showcaseBuffer = fs.readFileSync(garmentPath);
      }

      const watermarked = await addLuxuryWatermark(showcaseBuffer);
      return NextResponse.json({
        success: true,
        resultImage: `data:image/jpeg;base64,${watermarked.toString("base64")}`,
        engine: "Avoroni Haute Couture Editorial Showcase",
        productName: { bn: productNameBn, en: productNameEn },
        category,
      });
    }

    // 3. REAL USER TRY-ON (User Snapped a Photo or Uploaded Their Photo)
    const userBuffer = await resolveImageBuffer(userImage);

    // Normalize user photo to clean 3:4 portrait preserving head & face
    const userNormalized = await sharp(userBuffer)
      .resize(width, height, { fit: "cover", position: "top" })
      .toBuffer();

    let finalOutputBuffer: Buffer;
    let engineUsed = "Avoroni Haute Couture Atelier Drape Engine";

    if (category === "saree") {
      // 1. Attempt Real Neural Diffusion Try-On (Leffa / IDM-VTON)
      const neuralResult = await runNeuralTryOn(userNormalized, garmentPath, productNameEn);
      if (neuralResult && neuralResult.buffer) {
        finalOutputBuffer = neuralResult.buffer;
        engineUsed = neuralResult.engine;
      } else {
        // 2. Precision Saree Drape Fallback with Custom Fit
        const sareeMap: Record<string, string> = {
        "v-saree-1": "drape_jamdani_red.png",
        "v-saree-2": "drape_mirpur_red.png",
        "v-saree-3": "drape_jamdani_white.png",
        "v-saree-4": "drape_rajshahi_blue.png",
        "v-saree-5": "drape_banaras_red.png",
        "v-saree-6": "drape_kanchipuram_green.png",
        "v-saree-7": "drape_tangail_yellow.png",
        "v-saree-8": "drape_chanderi_red.png",
        "v-saree-9": "drape_jamdani_green.png",
        "v-saree-10": "drape_mirpur_purple.png",
      };

      let drapeFile = sareeMap[product.id];
      if (!drapeFile) {
        if (product.id?.includes("mirpur_purple") || product.image?.includes("mirpur_purple")) {
          drapeFile = "drape_mirpur_purple.png";
        } else if (product.id?.includes("mirpur") || product.image?.includes("mirpur")) {
          drapeFile = "drape_mirpur_red.png";
        } else if (product.id?.includes("white") || product.image?.includes("white")) {
          drapeFile = "drape_jamdani_white.png";
        } else if (product.id?.includes("rajshahi") || product.image?.includes("rajshahi")) {
          drapeFile = "drape_rajshahi_blue.png";
        } else if (product.id?.includes("banaras") || product.image?.includes("banaras")) {
          drapeFile = "drape_banaras_red.png";
        } else if (product.id?.includes("kanchipuram") || product.image?.includes("kanchipuram")) {
          drapeFile = "drape_kanchipuram_green.png";
        } else if (product.id?.includes("tangail") || product.image?.includes("tangail")) {
          drapeFile = "drape_tangail_yellow.png";
        } else if (product.id?.includes("chanderi") || product.image?.includes("chanderi")) {
          drapeFile = "drape_chanderi_red.png";
        } else if (product.id?.includes("jamdani_green") || product.image?.includes("jamdani_green")) {
          drapeFile = "drape_jamdani_green.png";
        } else {
          drapeFile = "drape_jamdani_red.png";
        }
      }

      let drapePath = path.join(publicDir, "images", "trial", drapeFile);
      if (!fs.existsSync(drapePath)) {
        drapePath = path.join(publicDir, "images", "trial", "drape_jamdani_red.png");
      }

      // Read custom fit parameters from frontend sliders (if provided)
      const scale = Number(customFit?.scale) || 1.0;
      const offsetX = Number(customFit?.offsetX) || 0;
      const offsetY = Number(customFit?.offsetY) || 0;

      const targetW = Math.round(width * scale);
      const targetH = Math.round(height * scale);

      // Resize transparent drape
      const scaledDrape = await sharp(drapePath)
        .resize(targetW, targetH, { fit: "fill" })
        .toBuffer();

      const leftPos = Math.round((width - targetW) / 2) + offsetX;
      const topPos = offsetY;

      // Safe intersection bounding box calculation to prevent Sharp out-of-bounds error
      const srcLeft = Math.max(0, -leftPos);
      const srcTop = Math.max(0, -topPos);
      const dstLeft = Math.max(0, leftPos);
      const dstTop = Math.max(0, topPos);
      const cropW = Math.min(width - dstLeft, targetW - srcLeft);
      const cropH = Math.min(height - dstTop, targetH - srcTop);

      if (cropW > 0 && cropH > 0) {
        const croppedDrape = await sharp(scaledDrape)
          .extract({ left: srcLeft, top: srcTop, width: cropW, height: cropH })
          .toBuffer();

        finalOutputBuffer = await sharp(userNormalized)
          .composite([{ input: croppedDrape, left: dstLeft, top: dstTop, blend: "over" }])
          .jpeg({ quality: 92 })
          .toBuffer();
      } else {
        finalOutputBuffer = userNormalized;
      }
      } // End of saree fallback block
    } else if (category === "jewelry") {
      // Heritage Jewelry styled naturally
      const jewelOverlayMap: Record<string, { file: string; top: number; widthPct: number }> = {
        "v-jewel-1": { file: "lifestyle/jewel_kundan_choker.jpg", top: Math.round(height * 0.32), widthPct: 0.28 },
        "v-jewel-2": { file: "lifestyle/jewel_chandbali_jhumka.jpg", top: Math.round(height * 0.23), widthPct: 0.22 },
        "v-jewel-3": { file: "lifestyle/jewel_chandrahaar_pendant.jpg", top: Math.round(height * 0.33), widthPct: 0.32 },
      };

      const jConf = jewelOverlayMap[product.id] || { file: "lifestyle/jewel_kundan_choker.jpg", top: Math.round(height * 0.32), widthPct: 0.28 };
      const jPath = path.join(publicDir, "images", jConf.file);
      const jWidth = Math.round(width * jConf.widthPct);

      if (fs.existsSync(jPath)) {
        const jScaled = await sharp(jPath)
          .resize(jWidth, jWidth, { fit: "cover" })
          .png()
          .toBuffer();

        const jLeft = Math.round((width - jWidth) / 2);

        finalOutputBuffer = await sharp(userNormalized)
          .composite([{ input: jScaled, top: jConf.top, left: jLeft, blend: "over" }])
          .jpeg({ quality: 92 })
          .toBuffer();
      } else {
        finalOutputBuffer = userNormalized;
      }
    } else if (category === "shawl") {
      // Kashmiri Shawl draped across shoulders
      const shawlPath = path.join(publicDir, "images", "lifestyle", "shawl_kashmiri_pashmina.jpg");
      if (fs.existsSync(shawlPath)) {
        const sWidth = Math.round(width * 0.7);
        const sScaled = await sharp(shawlPath)
          .resize(sWidth, Math.round(sWidth * 0.6), { fit: "cover" })
          .png()
          .toBuffer();
        const sLeft = Math.round((width - sWidth) / 2);
        const sTop = Math.round(height * 0.40);

        finalOutputBuffer = await sharp(userNormalized)
          .composite([{ input: sScaled, top: sTop, left: sLeft, blend: "over" }])
          .jpeg({ quality: 92 })
          .toBuffer();
      } else {
        finalOutputBuffer = userNormalized;
      }
    } else {
      // Clutch / Potli held at waist level
      const potliPath = path.join(publicDir, "images", "lifestyle", "potli_zardozi_velvet.jpg");
      if (fs.existsSync(potliPath)) {
        const pWidth = Math.round(width * 0.28);
        const pScaled = await sharp(potliPath)
          .resize(pWidth, pWidth, { fit: "cover" })
          .png()
          .toBuffer();
        const pLeft = Math.round(width * 0.62);
        const pTop = Math.round(height * 0.60);

        finalOutputBuffer = await sharp(userNormalized)
          .composite([{ input: pScaled, top: pTop, left: pLeft, blend: "over" }])
          .jpeg({ quality: 92 })
          .toBuffer();
      } else {
        finalOutputBuffer = userNormalized;
      }
    }

    const watermarkedBuffer = await addLuxuryWatermark(finalOutputBuffer);

    return NextResponse.json({
      success: true,
      resultImage: `data:image/jpeg;base64,${watermarkedBuffer.toString("base64")}`,
      engine: engineUsed,
      productName: { bn: productNameBn, en: productNameEn },
      category,
    });
  } catch (error: any) {
    console.error("AI Try-On API error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process AI try-on" },
      { status: 500 }
    );
  }
}
