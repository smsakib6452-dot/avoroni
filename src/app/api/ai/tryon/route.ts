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
        // proceed to other resolvers
      }
    }
  }

  // 3. Remote URL (http / https e.g. Vercel deployment origin or Supabase/Cloudinary)
  if (imageInput.startsWith("http://") || imageInput.startsWith("https://")) {
    try {
      const res = await fetch(imageInput);
      if (res.ok) {
        return Buffer.from(await res.arrayBuffer());
      }
    } catch (e) {
      // proceed to relative origin fetch
    }
  }

  // 4. Relative URL with request origin (essential on Vercel Serverless environment)
  if (imageInput.startsWith("/") && reqOrigin) {
    try {
      const absoluteUrl = `${reqOrigin}${imageInput}`;
      const res = await fetch(absoluteUrl);
      if (res.ok) {
        return Buffer.from(await res.arrayBuffer());
      }
    } catch (e) {
      // fallback
    }
  }

  // 5. Raw base64 fallback
  try {
    const rawBuf = Buffer.from(imageInput, "base64");
    if (rawBuf.length > 500) {
      return rawBuf;
    }
  } catch (e) {
    // ignore
  }

  // Final guaranteed fallback
  return createFallbackCanvas();
}

// Guaranteed 896x1200 Haute Couture Canvas (Prevents any ENOENT crashes on Vercel)
async function createFallbackCanvas(): Promise<Buffer> {
  const svg = `
    <svg width="896" height="1200" viewBox="0 0 896 1200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="luxBg" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stop-color="#301018" />
          <stop offset="60%" stop-color="#190A0D" />
          <stop offset="100%" stop-color="#0E0507" />
        </radialGradient>
      </defs>
      <rect width="896" height="1200" fill="url(#luxBg)" />
      <circle cx="448" cy="380" r="140" fill="#240D13" stroke="#C5A869" stroke-width="2" opacity="0.6" />
      <path d="M 280 850 C 340 650, 556 650, 616 850 Z" fill="#240D13" stroke="#C5A869" stroke-width="2" opacity="0.6" />
      <text x="448" y="1120" font-family="serif" font-size="28" fill="#F5F0E8" text-anchor="middle" letter-spacing="8" opacity="0.9">AVORONI DHAKA</text>
      <text x="448" y="1155" font-family="sans-serif" font-size="14" fill="#C5A869" text-anchor="middle" letter-spacing="4" opacity="0.8">HAUTE COUTURE AI ATELIER</text>
    </svg>
  `;
  return await sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toBuffer();
}

function getLoc(val: any, lang: "bn" | "en" = "bn"): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  return val[lang] || val.en || "";
}

// Helper to resolve Gemini API Key from Environment or Admin settings (siteContent.json)
function getGeminiApiKey(): string {
  const envKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY;
  if (envKey && envKey.trim().length > 0) {
    return envKey.trim();
  }

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
  apiKey: string,
  userBuffer?: Buffer | null
): Promise<string | null> {
  if (!apiKey) return null;

  try {
    const candidateModels = [
      "gemini-3.5-flash",
      "gemini-3.6-flash",
      "gemini-3.7-flash",
      "gemini-2.5-flash",
      "gemini-flash-latest",
    ];

    let imagePart: any = null;
    if (userBuffer) {
      try {
        const thumb = await sharp(userBuffer)
          .resize(320, 400, { fit: "cover" })
          .jpeg({ quality: 80 })
          .toBuffer();
        imagePart = {
          inlineData: {
            data: thumb.toString("base64"),
            mimeType: "image/jpeg",
          },
        };
      } catch (e) {
        // ignore image thumbnail error
      }
    }

    const promptText = imagePart
      ? `You are an elite Bangladeshi haute couture fashion stylist for Avoroni Dhaka. Looking at this client's photo and skin tone/profile, she is trying on this handcrafted ${productName} (${category}). In 1 single elegant, warm sentence in Bengali (বাংলা), give a personalized styling compliment or jewelry recommendation (e.g. Kundan, Polki, gold jhumka, or pearl jewelry) that specifically complements her look. Keep it aristocratic and concise without quotes or markdown.`
      : `You are an elite Bangladeshi haute couture fashion stylist for Avoroni Dhaka. A client is trying on this handcrafted ${productName} (${category}). In 1 single elegant sentence in Bengali (বাংলা), write an authentic styling compliment or jewelry recommendation (e.g. Kundan, Polki, or pearl jewelry). Keep it warm, aristocratic, and concise without quotes or markdown.`;

    const parts: any[] = [{ text: promptText }];
    if (imagePart) {
      parts.unshift(imagePart);
    }

    for (const modelName of candidateModels) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;
        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            contents: [{ role: "user", parts }],
            generationConfig: {
              maxOutputTokens: 100,
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

const SAREE_DRAPE_MAP: Record<string, string> = {
  "v-saree-1": "/images/trial/drape_jamdani_red.png",
  "v-saree-2": "/images/trial/drape_mirpur_red.png",
  "v-saree-3": "/images/trial/drape_jamdani_white.png",
  "v-saree-4": "/images/trial/drape_rajshahi_blue.png",
  "v-saree-5": "/images/trial/drape_banaras_red.png",
  "v-saree-6": "/images/trial/drape_kanchipuram_green.png",
  "v-saree-7": "/images/trial/drape_tangail_yellow.png",
  "v-saree-8": "/images/trial/drape_chanderi_red.png",
  "v-saree-9": "/images/trial/drape_jamdani_green.png",
  "v-saree-10": "/images/trial/drape_mirpur_purple.png",
};

function resolveSareeDrape(product: any): string {
  if (product.overlayImage) return product.overlayImage;
  if (SAREE_DRAPE_MAP[product.id]) return SAREE_DRAPE_MAP[product.id];

  const id = (product.id || "").toLowerCase();
  const nameEn = (product.name?.en || "").toLowerCase();
  const nameBn = (product.name?.bn || "").toLowerCase();
  const img = (product.image || "").toLowerCase();

  // White / Ivory Jamdani
  if (id.includes("white") || nameEn.includes("white") || nameBn.includes("শুভ্র") || img.includes("white")) {
    return "/images/trial/drape_jamdani_white.png";
  }

  // Blue / Sapphire / Meghdoot
  if (id.includes("blue") || nameEn.includes("blue") || nameBn.includes("নীল") || img.includes("blue")) {
    return "/images/trial/drape_rajshahi_blue.png";
  }

  // Yellow / Haldi / Basanti / Mustard
  if (id.includes("yellow") || nameEn.includes("yellow") || nameBn.includes("হলুদ") || img.includes("yellow")) {
    return "/images/trial/drape_tangail_yellow.png";
  }

  // Green / Emerald / Peacock
  if (id.includes("green") || nameEn.includes("green") || nameBn.includes("সবুজ") || img.includes("green")) {
    if (id.includes("kanchipuram") || nameEn.includes("kanchipuram")) {
      return "/images/trial/drape_kanchipuram_green.png";
    }
    return "/images/trial/drape_jamdani_green.png";
  }

  // Purple / Jamuni
  if (id.includes("purple") || nameEn.includes("purple") || nameBn.includes("জামুনি") || nameBn.includes("বেগুনি") || img.includes("purple")) {
    return "/images/trial/drape_mirpur_purple.png";
  }

  // Regional specific fallbacks
  if (id.includes("mirpur") || nameEn.includes("mirpur")) {
    return "/images/trial/drape_mirpur_red.png";
  }
  if (id.includes("banaras") || nameEn.includes("banaras")) {
    return "/images/trial/drape_banaras_red.png";
  }
  if (id.includes("chanderi") || nameEn.includes("chanderi")) {
    return "/images/trial/drape_chanderi_red.png";
  }
  if (id.includes("kanchipuram") || nameEn.includes("kanchipuram")) {
    return "/images/trial/drape_kanchipuram_green.png";
  }
  if (id.includes("rajshahi") || nameEn.includes("rajshahi")) {
    return "/images/trial/drape_rajshahi_blue.png";
  }
  if (id.includes("tangail") || nameEn.includes("tangail")) {
    return "/images/trial/drape_tangail_yellow.png";
  }

  return "/images/trial/drape_jamdani_red.png";
}

async function synthesizeClientTryOn({
  userBuffer,
  drapeBuffer,
  customFit,
}: {
  userBuffer: Buffer;
  drapeBuffer: Buffer;
  customFit?: { scale?: number; offsetX?: number; offsetY?: number };
}): Promise<Buffer> {
  const width = 896;
  const height = 1200;

  // 1. Prepare base user portrait with top/face alignment
  const baseUser = await sharp(userBuffer)
    .resize(width, height, { fit: "cover", position: "top" })
    .toBuffer();

  const scale = customFit?.scale || 2.1;
  const offsetX = customFit?.offsetX || 0;
  // If offsetY is small (e.g. 70), calibrate so neckline sits naturally at collarbones
  const rawOffsetY = customFit?.offsetY !== undefined ? customFit.offsetY : 70;
  const offsetY = rawOffsetY === 70 ? 170 : rawOffsetY;

  const drapeMeta = await sharp(drapeBuffer).metadata();
  const drapeW = Math.round(width * scale);
  const drapeH = Math.round(((drapeMeta.height || 1200) / (drapeMeta.width || 896)) * drapeW);

  // Resize drape with high-quality lanczos3
  const resizedDrape = await sharp(drapeBuffer)
    .resize(drapeW, drapeH, { fit: "contain", kernel: "lanczos3" })
    .toBuffer();

  const left = Math.round((width - drapeW) / 2 + offsetX);
  const top = Math.round((height - drapeH) / 2 + offsetY);

  const srcX = left < 0 ? -left : 0;
  const srcY = top < 0 ? -top : 0;
  const dstX = left < 0 ? 0 : left;
  const dstY = top < 0 ? 0 : top;

  const cropW = Math.min(drapeW - srcX, width - dstX);
  const cropH = Math.min(drapeH - srcY, height - dstY);

  if (cropW <= 0 || cropH <= 0) {
    return baseUser;
  }

  const visibleDrape = await sharp(resizedDrape)
    .extract({ left: srcX, top: srcY, width: cropW, height: cropH })
    .toBuffer();

  // Create soft drop shadow for 3D realism
  const alphaChannel = await sharp(visibleDrape)
    .extractChannel(3)
    .toBuffer();

  const shadowAlpha = await sharp(alphaChannel)
    .blur(16)
    .linear(0.42, 0)
    .toBuffer();

  const shadowLayer = await sharp({
    create: {
      width: cropW,
      height: cropH,
      channels: 4,
      background: { r: 12, g: 7, b: 7, alpha: 0.45 },
    },
  })
    .composite([{ input: shadowAlpha, blend: "dest-in" }])
    .png()
    .toBuffer();

  return await sharp(baseUser)
    .composite([
      {
        input: shadowLayer,
        top: Math.min(height - cropH, dstY + 8),
        left: Math.min(width - cropW, dstX + 4),
        blend: "multiply",
      },
      {
        input: visibleDrape,
        top: dstY,
        left: dstX,
        blend: "over",
      },
    ])
    .jpeg({ quality: 95 })
    .toBuffer();
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
    const category = product.category || "saree";
    const productNameBn = getLoc(product.name, "bn") || "সিগনেচার কালেকশন";
    const productNameEn = getLoc(product.name, "en") || "Signature Heritage Drape";

    // Standard 3:4 portrait dimensions
    const width = 896;
    const height = 1200;

    // Prepare Luxury Avoroni Dhaka Watermark Function (Crisp vector shadow & gold seal insignia)
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
          
          <!-- Luxury Gold Seal Medallion (Pure Vector Shapes - 100% Font-Independent) -->
          <circle cx="${w - 65}" cy="${h - 56}" r="24" fill="#4A151E" stroke="#C5A869" stroke-width="2" />
          <circle cx="${w - 65}" cy="${h - 56}" r="20" fill="none" stroke="#C5A869" stroke-width="1" stroke-dasharray="3,3" />
          <polygon points="${w-65},${h-66} ${w-62},${h-57} ${w-53},${h-57} ${w-60},${h-52} ${w-57},${h-43} ${w-65},${h-48} ${w-73},${h-43} ${w-70},${h-52} ${w-77},${h-57} ${w-68},${h-57}" fill="#FFF0A0" />
        </svg>
      `;

      return await sharp(imageBuffer)
        .resize(w, h, { fit: "cover" })
        .composite([{ input: Buffer.from(watermarkSvg), top: 0, left: 0, blend: "over" }])
        .jpeg({ quality: 94 })
        .toBuffer();
    };

    // Fetch AI styling tip (from Google Gemini with visual understanding, falling back to authentic curated styling advice)
    const geminiKey = getGeminiApiKey();
    const userBufForTip = (sourceMode !== "model" && userImage) ? await resolveImageBuffer(userImage, reqOrigin) : null;
    let stylingTip = await fetchGeminiStylingTip(productNameBn, category, geminiKey, userBufForTip);
    if (!stylingTip) {
      if (category === "saree") {
        stylingTip = `এই ঐতিহ্যবাহী ${productNameBn} শাড়ির সাথে এন্টিক কুন্দন ও পোলকি জুয়েলারি আভিজাত্য এনে দেবে।`;
      } else if (category === "jewelry") {
        stylingTip = `এই রাজকীয় গয়নার সাথে লাল বা মেরুন রঙের কাতান শাড়ি সম্পূর্ণ ব্রাইডাল আভিজাত্য ফুটিয়ে তোলে।`;
      } else if (category === "shawl") {
        stylingTip = `এই কাশ্মীরি পশমিনা শালটি যেকোনো সন্ধ্যার আভিজাত্যপূর্ণ পোশাকের সাথে রাজকীয় ছোঁয়া প্রদান করে।`;
      } else if (category === "suit") {
        stylingTip = `এই আনস্টিচড ৩-পিস পোশাকটি আপনার শারীরিক মাপে অনন্য আভিজাত্য ও স্নিগ্ধতা প্রকাশ করবে।`;
      } else {
        stylingTip = `এই ঐতিহ্যবাহী পিসটি আপনার উৎসবের সাজে এক অনন্য মাত্রা যোগ করবে।`;
      }
    }

    const atelierEngine = geminiKey ? "Google Gemini Haute Couture AI Studio" : "Avoroni Haute Couture AI Neural Atelier";

    // =========================================================================
    // 1. CLIENT VIRTUAL TRY-ON (USER'S ACTUAL PHOTO IS THE 100% PRESERVED CANVAS)
    // Seamlessly fits and drapes the authentic saree/garment onto the user!
    // =========================================================================
    if (sourceMode !== "model" && userImage) {
      try {
        console.log(`Executing Client Fitting for ${category} (${product.id})...`);
        const userBuffer = await resolveImageBuffer(userImage, reqOrigin);

        if (category === "saree") {
          const drapePath = resolveSareeDrape(product);
          const drapeBuffer = await resolveImageBuffer(drapePath, reqOrigin);

          const clientLook = await synthesizeClientTryOn({
            userBuffer,
            drapeBuffer,
            customFit,
          });

          const watermarked = await addLuxuryWatermark(clientLook);

          return NextResponse.json({
            success: true,
            resultImage: `data:image/jpeg;base64,${watermarked.toString("base64")}`,
            engine: atelierEngine,
            stylingTip,
            productName: { bn: productNameBn, en: productNameEn },
            category,
            isClientFit: true,
          });
        } else if (category === "jewelry") {
          let jewelDrape = "/images/trial/real_kundan_choker.png";
          if (product.id === "jewel-2" || product.id === "v-jewel-2") {
            jewelDrape = "/images/trial/real_polki_jhumka.png";
          }
          const drapeBuffer = await resolveImageBuffer(jewelDrape, reqOrigin);
          const clientLook = await synthesizeClientTryOn({
            userBuffer,
            drapeBuffer,
            customFit: { scale: 1.2, offsetX: 0, offsetY: 220 },
          });
          const watermarked = await addLuxuryWatermark(clientLook);
          return NextResponse.json({
            success: true,
            resultImage: `data:image/jpeg;base64,${watermarked.toString("base64")}`,
            engine: atelierEngine,
            stylingTip,
            productName: { bn: productNameBn, en: productNameEn },
            category,
            isClientFit: true,
          });
        } else {
          // For other categories (suit, shawl, clutch), fuse onto user portrait
          const drapePath = product.image || "/images/lifestyle/suits_cover.jpg";
          const drapeBuffer = await resolveImageBuffer(drapePath, reqOrigin);
          const clientLook = await synthesizeClientTryOn({
            userBuffer,
            drapeBuffer,
            customFit,
          });
          const watermarked = await addLuxuryWatermark(clientLook);
          return NextResponse.json({
            success: true,
            resultImage: `data:image/jpeg;base64,${watermarked.toString("base64")}`,
            engine: atelierEngine,
            stylingTip,
            productName: { bn: productNameBn, en: productNameEn },
            category,
            isClientFit: true,
          });
        }
      } catch (clientErr: any) {
        console.error("Client fitting error:", clientErr.message);
      }
    }

    // =========================================================================
    // 2. DEMO MODEL MODE (Showcase on editorial atelier model)
    // =========================================================================
    let rawTargetInput = product.image || product.overlayImage;
    if (category === "jewelry") {
      if (product.id === "v-jewel-1") {
        rawTargetInput = "/images/editorial_portrait.jpg";
      } else if (product.id === "v-jewel-2") {
        rawTargetInput = "/images/contact_intro.jpg";
      } else if (product.id === "v-jewel-3") {
        rawTargetInput = "/images/lifestyle/jewelry_cover.jpg";
      } else {
        rawTargetInput = product.image || "/images/lifestyle/jewelry_cover.jpg";
      }
    } else if (category === "shawl") {
      rawTargetInput = product.image || (product.id === "v-shawl-2" ? "/images/lifestyle/shawls_cover.jpg" : "/images/lifestyle/shawl_kashmiri_pashmina.jpg");
    } else if (category === "clutch") {
      rawTargetInput = product.image || "/images/editorial_large.jpg";
    } else if (category === "suit") {
      rawTargetInput = product.image || "/images/lifestyle/suits_cover.jpg";
    }

    if (!rawTargetInput) {
      rawTargetInput = "/images/colorways/jamdani_red.jpg";
    }

    const targetBuffer = await resolveImageBuffer(rawTargetInput, reqOrigin);

    // =========================================================================
    // HAUTE COUTURE ATELIER SHOWCASE (Demo Model Mode)
    // =========================================================================
    const watermarked = await addLuxuryWatermark(targetBuffer);

    return NextResponse.json({
      success: true,
      resultImage: `data:image/jpeg;base64,${watermarked.toString("base64")}`,
      engine: geminiKey ? "Google Gemini Haute Couture AI Studio" : "Avoroni Haute Couture AI Editorial Atelier",
      stylingTip,
      productName: { bn: productNameBn, en: productNameEn },
      category,
      isClientFit: false,
    });
  } catch (error: any) {
    console.error("AI Try-On API error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process AI try-on" },
      { status: 500 }
    );
  }
}
