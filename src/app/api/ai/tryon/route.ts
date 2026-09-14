import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import fs from "fs";
import path from "path";

// Robust buffer resolution supporting Base64, Data URLs, local file paths, and Vercel CDN URLs
async function resolveImageBuffer(imageInput: string, reqOrigin?: string): Promise<Buffer> {
  if (!imageInput) {
    return createFallbackCanvas();
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
      try {
        return fs.readFileSync(fullPath);
      } catch (e) {
        // ignore and fallback
      }
    }

    // Remote fetch fallback for Vercel Serverless Edge CDN
    if (reqOrigin) {
      try {
        const fetchUrl = `${reqOrigin.replace(/\/$/, "")}/${cleanPath}`;
        const res = await fetch(fetchUrl);
        if (res.ok) {
          return Buffer.from(await res.arrayBuffer());
        }
      } catch (e) {
        // ignore and fallback
      }
    }
  }

  // 3. Remote URL (http / https e.g. Cloudinary or Supabase Storage)
  if (imageInput.startsWith("http://") || imageInput.startsWith("https://")) {
    try {
      const res = await fetch(imageInput);
      if (res.ok) {
        return Buffer.from(await res.arrayBuffer());
      }
    } catch (e) {
      // ignore and fallback
    }
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

  // 5. Default contact intro fallback
  try {
    const defaultPath = path.join(process.cwd(), "public", "images", "contact_intro.jpg");
    if (fs.existsSync(defaultPath)) {
      return fs.readFileSync(defaultPath);
    }
    if (reqOrigin) {
      const res = await fetch(`${reqOrigin.replace(/\/$/, "")}/images/contact_intro.jpg`);
      if (res.ok) return Buffer.from(await res.arrayBuffer());
    }
  } catch (e) {}

  return createFallbackCanvas();
}

async function createFallbackCanvas(): Promise<Buffer> {
  return await sharp({
    create: {
      width: 896,
      height: 1200,
      channels: 4,
      background: { r: 24, g: 18, b: 17, alpha: 1 },
    },
  })
    .jpeg({ quality: 90 })
    .toBuffer();
}

function getLoc(val: any, lang: "bn" | "en" = "bn"): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  return val[lang] || val.en || "";
}

// Helper to resolve Gemini API Key from Environment or Admin settings (siteContent.json)
function getGeminiApiKey(): string {
  // 1. Check environment variables (.env.local, .env)
  const envKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY;
  if (envKey && envKey.trim().length > 0) {
    return envKey.trim();
  }

  // 2. Check siteContent.json saved from /admin
  try {
    const contentPath = path.join(process.cwd(), "src", "data", "siteContent.json");
    if (fs.existsSync(contentPath)) {
      const raw = fs.readFileSync(contentPath, "utf8");
      const parsed = JSON.parse(raw);
      if (parsed?.aiEngine?.geminiApiKey && typeof parsed.aiEngine.geminiApiKey === "string") {
        const key = parsed.aiEngine.geminiApiKey.trim();
        if (key.length > 0) return key;
      }
    }
  } catch (err) {
    console.warn("Notice: could not read siteContent.json for Gemini API key", err);
  }

  return "";
}

// Fetch AI Fashion Stylist Critique & Jewelry Advice from Google Gemini
async function fetchGeminiStylingTip(
  productName: string,
  category: string,
  apiKey: string
): Promise<string | null> {
  if (!apiKey) return null;

  try {
    const candidateModels = ["gemini-flash-latest", "gemini-2.5-flash", "gemini-1.5-flash"];
    for (const modelName of candidateModels) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `You are an elite Bangladeshi haute couture fashion stylist for Avoroni Dhaka. A client is trying on this handcrafted ${productName} (${category}). In 1 single elegant sentence in Bengali (বাংলা), write an authentic styling compliment or jewelry recommendation (e.g. Kundan, Polki, or pearl jewelry). Keep it warm, aristocratic, and concise without quotes or markdown.`,
                  },
                ],
              },
            ],
            generationConfig: {
              maxOutputTokens: 80,
              temperature: 0.7,
            },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const tipText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (tipText) {
            return tipText.trim();
          }
        }
      } catch (e) {
        // try next candidate
      }
    }
  } catch (err: any) {
    console.warn("Gemini styling tip notice:", err.message);
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

    const reqOrigin = req.nextUrl?.origin || "https://" + (req.headers.get("host") || "localhost:3000");
    const publicDir = path.join(process.cwd(), "public");
    const category = product.category || "saree";
    const productNameBn = getLoc(product.name, "bn") || "সিগনেচার কালেকশন";
    const productNameEn = getLoc(product.name, "en") || "Signature Heritage Drape";

    // 1. Resolve exact garment image buffer (supports remote URLs e.g. Cloudinary, local paths, base64)
    const rawGarmentInput = product.image || product.overlayImage || "/images/colorways/jamdani_red.jpg";
    const garmentBuffer = await resolveImageBuffer(rawGarmentInput, reqOrigin);

    // Standard 3:4 portrait dimensions
    const width = 896;
    const height = 1200;

    // Prepare Luxury Avoroni Dhaka Watermark Function (Crisp typography + SVG vector insignia)
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
          <text x="45" y="${h - 42}" font-family="system-ui, -apple-system, sans-serif" font-size="13" fill="#C5A869" letter-spacing="2" font-weight="600">AI VIRTUAL ATELIER • ${productNameEn.toUpperCase()}</text>
          
          <circle cx="${w - 65}" cy="${h - 56}" r="24" fill="#4A151E" stroke="#C5A869" stroke-width="2" />
          <circle cx="${w - 65}" cy="${h - 56}" r="20" fill="none" stroke="#C5A869" stroke-width="1" stroke-dasharray="3,3" />
          <polygon points="${w-65},${h-66} ${w-62},${h-57} ${w-53},${h-57} ${w-60},${h-52} ${w-57},${h-43} ${w-65},${h-48} ${w-73},${h-43} ${w-70},${h-52} ${w-77},${h-57} ${w-68},${h-57}" fill="#FFF0A0" />
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

    // Fetch AI styling tip (from Gemini if API key available, otherwise authentic curated styling advice)
    const geminiKey = getGeminiApiKey();
    let stylingTip = await fetchGeminiStylingTip(productNameBn, category, geminiKey);
    if (!stylingTip) {
      if (category === "saree") {
        stylingTip = `এই ঐতিহ্যবাহী ${productNameBn} শাড়ির সাথে এন্টিক কুন্দন ও পোলকি জুয়েলারি আভিজাত্য এনে দেবে।`;
      } else if (category === "jewelry") {
        stylingTip = `এই রাজকীয় গয়নার সাথে লাল বা মেরুন রঙের কাতান শাড়ি সম্পূর্ণ ব্রাইডাল আভিজাত্য ফুটিয়ে তোলে।`;
      } else if (category === "shawl") {
        stylingTip = `এই কাশ্মীরি পশমিনা শালটি যেকোনো সন্ধ্যার আভিজাত্যপূর্ণ পোশাকের সাথে রাজকীয় ছোঁয়া প্রদান করে।`;
      } else {
        stylingTip = `এই ঐতিহ্যবাহী পিসটি আপনার উৎসবের সাজে এক অনন্য মাত্রা যোগ করবে।`;
      }
    }

    // =========================================================================
    // 2. DEMO MODEL SHOWCASE: 100% Crystal-Clear, Untouched Face & Master Saree
    // =========================================================================
    if (isDemoModel) {
      let showcaseBuffer: Buffer;
      if (category === "saree") {
        showcaseBuffer = garmentBuffer;
      } else if (category === "jewelry") {
        const jewelMap: Record<string, string> = {
          "v-jewel-1": "images/lifestyle/jewel_kundan_choker.jpg",
          "v-jewel-2": "images/lifestyle/jewel_chandbali_jhumka.jpg",
          "v-jewel-3": "images/lifestyle/jewel_chandrahaar_pendant.jpg",
        };
        const jFile = jewelMap[product.id] || "images/lifestyle/jewelry_cover.jpg";
        showcaseBuffer = await resolveImageBuffer(jFile, reqOrigin);
      } else if (category === "shawl") {
        showcaseBuffer = await resolveImageBuffer("images/lifestyle/shawls_cover.jpg", reqOrigin);
      } else if (category === "clutch") {
        showcaseBuffer = await resolveImageBuffer("images/lifestyle/clutches_cover.jpg", reqOrigin);
      } else {
        showcaseBuffer = garmentBuffer;
      }

      const watermarked = await addLuxuryWatermark(showcaseBuffer);
      return NextResponse.json({
        success: true,
        resultImage: `data:image/jpeg;base64,${watermarked.toString("base64")}`,
        engine: "Avoroni Haute Couture Editorial Atelier",
        stylingTip,
        productName: { bn: productNameBn, en: productNameEn },
        category,
      });
    }

    // =========================================================================
    // 3. REAL CUSTOMER TRY-ON (User Snapped Photo or Uploaded Photo)
    // The customer's face, neck, hair, and genuine portrait are 100% PRESERVED!
    // Saree drape is overlaid naturally on shoulders & torso below neckline.
    // =========================================================================
    const userBuffer = await resolveImageBuffer(userImage, reqOrigin);

    // Normalize user photo to clean 3:4 portrait preserving genuine identity
    const userNormalized = await sharp(userBuffer)
      .resize(width, height, { fit: "cover", position: "top" })
      .toBuffer();

    let finalOutputBuffer: Buffer | null = null;
    const engineUsed = "Avoroni AI Virtual Fitting Atelier";

    if (category === "saree") {
      let drapeBuffer: Buffer | null = null;

      // 1. If product has custom overlay / drape image
      if (product.overlayImage) {
        try {
          drapeBuffer = await resolveImageBuffer(product.overlayImage, reqOrigin);
        } catch (e) {}
      }

      // 2. Map saree to authentic high-resolution transparent drape PNG
      if (!drapeBuffer) {
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

        const drapePath = path.join(publicDir, "images", "trial", drapeFile);
        if (fs.existsSync(drapePath)) {
          try {
            drapeBuffer = fs.readFileSync(drapePath);
          } catch (e) {}
        }

        // Fallback fetch from Vercel CDN origin if file is on CDN
        if (!drapeBuffer && reqOrigin) {
          try {
            const res = await fetch(`${reqOrigin.replace(/\/$/, "")}/images/trial/${drapeFile}`);
            if (res.ok) {
              drapeBuffer = Buffer.from(await res.arrayBuffer());
            }
          } catch (e) {}
        }
      }

      // 3. Fallback to garmentBuffer if drape PNG is not found
      if (!drapeBuffer) {
        drapeBuffer = garmentBuffer;
      }

      // 4. Calculate Precision Fit Coordinates
      // Clamped scale from 0.6x to 2.4x (default 1.15x)
      const scale = Math.max(0.6, Math.min(2.4, Number(customFit?.scale) || 1.15));
      const targetW = Math.round(width * scale);
      const targetH = Math.round(height * scale);

      const scaledDrape = await sharp(drapeBuffer)
        .resize(targetW, targetH, { fit: "fill" })
        .toBuffer();

      // Screen coordinate conversion: frontend modal canvas is ~600px tall vs 1200px server resolution
      const coordScale = 1.8;
      const shiftX = Math.round(Number(customFit?.offsetX || 0) * coordScale);
      const shiftY = Math.round(Number(customFit?.offsetY !== undefined ? customFit.offsetY : 160) * coordScale);

      const leftPos = Math.round((width - targetW) / 2) + shiftX;
      const initialTop = Math.round((height - targetH) / 2) + shiftY;

      // Absolute safety rule: Saree drape must NEVER encroach onto the face or eyes (minimum y >= 20% of height)
      const minTopY = Math.round(height * 0.20);
      const topPos = Math.max(minTopY, initialTop);

      // Bounding box intersection calculation
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
    } else if (category === "jewelry") {
      // Heritage Jewelry styled naturally
      const jewelOverlayMap: Record<string, { file: string; top: number; widthPct: number }> = {
        "v-jewel-1": { file: "images/lifestyle/jewel_kundan_choker.jpg", top: Math.round(height * 0.32), widthPct: 0.28 },
        "v-jewel-2": { file: "images/lifestyle/jewel_chandbali_jhumka.jpg", top: Math.round(height * 0.23), widthPct: 0.22 },
        "v-jewel-3": { file: "images/lifestyle/jewel_chandrahaar_pendant.jpg", top: Math.round(height * 0.33), widthPct: 0.32 },
      };

      const jConf = jewelOverlayMap[product.id] || { file: "images/lifestyle/jewel_kundan_choker.jpg", top: Math.round(height * 0.32), widthPct: 0.28 };
      const jBuffer = await resolveImageBuffer(jConf.file, reqOrigin);
      const jWidth = Math.round(width * jConf.widthPct);

      const jScaled = await sharp(jBuffer)
        .resize(jWidth, jWidth, { fit: "cover" })
        .png()
        .toBuffer();

      const jLeft = Math.round((width - jWidth) / 2);

      finalOutputBuffer = await sharp(userNormalized)
        .composite([{ input: jScaled, top: jConf.top, left: jLeft, blend: "over" }])
        .jpeg({ quality: 92 })
        .toBuffer();
    } else if (category === "shawl") {
      // Kashmiri Shawl draped across shoulders
      const sBuffer = await resolveImageBuffer("images/lifestyle/shawl_kashmiri_pashmina.jpg", reqOrigin);
      const sWidth = Math.round(width * 0.7);
      const sScaled = await sharp(sBuffer)
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
      // Clutch / Potli held at waist level
      const pBuffer = await resolveImageBuffer("images/lifestyle/potli_zardozi_velvet.jpg", reqOrigin);
      const pWidth = Math.round(width * 0.28);
      const pScaled = await sharp(pBuffer)
        .resize(pWidth, pWidth, { fit: "cover" })
        .png()
        .toBuffer();
      const pLeft = Math.round(width * 0.62);
      const pTop = Math.round(height * 0.60);

      finalOutputBuffer = await sharp(userNormalized)
        .composite([{ input: pScaled, top: pTop, left: pLeft, blend: "over" }])
        .jpeg({ quality: 92 })
        .toBuffer();
    }

    if (!finalOutputBuffer) {
      finalOutputBuffer = userNormalized;
    }

    const watermarkedBuffer = await addLuxuryWatermark(finalOutputBuffer);

    return NextResponse.json({
      success: true,
      resultImage: `data:image/jpeg;base64,${watermarkedBuffer.toString("base64")}`,
      engine: engineUsed,
      stylingTip,
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
