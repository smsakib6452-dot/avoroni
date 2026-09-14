import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { Client } from "@gradio/client";

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
  apiKey: string
): Promise<string | null> {
  if (!apiKey) return null;

  try {
    const candidateModels = ["gemini-3.6-flash", "gemini-2.5-flash", "gemini-flash-latest"];
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
    const { userImage, product, sourceMode = "camera" } = body;

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

    // 1. Resolve exact target editorial model image (supports sarees, jewelry, shawls, clutches)
    let rawTargetInput = product.image || product.overlayImage;
    if (category === "jewelry") {
      if (product.id === "v-jewel-1") {
        rawTargetInput = "/images/editorial_portrait.jpg"; // Model wearing Royal Kundan Choker & matching jewelry
      } else if (product.id === "v-jewel-2") {
        rawTargetInput = "/images/contact_intro.jpg"; // Model wearing Imperial Polki Jhumkas
      } else if (product.id === "v-jewel-3") {
        rawTargetInput = "/images/lifestyle/jewelry_cover.jpg"; // Model wearing Mughal Chandrahaar
      } else {
        rawTargetInput = "/images/lifestyle/jewelry_cover.jpg";
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
      } else if (category === "suit") {
        stylingTip = `এই আনস্টিচড ৩-পিস পোশাকটি আপনার শারীরিক মাপে অনন্য আভিজাত্য ও স্নিগ্ধতা প্রকাশ করবে।`;
      } else {
        stylingTip = `এই ঐতিহ্যবাহী পিসটি আপনার উৎসবের সাজে এক অনন্য মাত্রা যোগ করবে।`;
      }
    }

    // =========================================================================
    // REAL AI NEURAL VIRTUAL TRY-ON (IDENTITY-PRESERVING HAUTE COUTURE FITTING)
    // Seamlessly transfers the customer's exact face, eyes, smile, skin tone,
    // and facial features onto the chosen royal handcrafted saree or jewelry look!
    // =========================================================================
    if (sourceMode !== "model" && userImage) {
      try {
        console.log(`Executing Identity-Preserving Neural Atelier Fitting for ${category} (${product.id})...`);
        const userBuffer = await resolveImageBuffer(userImage, reqOrigin);

        // Normalize user image to clean 896x1200 portrait for facial landmark detection
        const userResized = await sharp(userBuffer)
          .resize(896, 1200, { fit: "cover", position: "top" })
          .jpeg({ quality: 94 })
          .toBuffer();

        const targetBlob = new Blob([new Uint8Array(targetBuffer)], { type: "image/jpeg" });
        const sourceBlob = new Blob([new Uint8Array(userResized)], { type: "image/jpeg" });

        // Primary Engine: High-Precision Neural Face-Swap & Skin Tone Synthesis
        try {
          const swapClient = await Client.connect("felixrosberg/face-swap");
          const swapPromise = swapClient.predict("/run_inference", [
            targetBlob, // Target: Royal model wearing the authentic saree/jewelry
            sourceBlob, // Source: Customer's exact face/selfie/hijab photo
            100,
            100,
            []
          ]);

          const swapTimeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Face swap timeout")), 25000)
          );

          const swapResult: any = await Promise.race([swapPromise, swapTimeout]);
          const swapUrl = swapResult?.data?.[0]?.url;

          if (swapUrl) {
            const fetchRes = await fetch(swapUrl);
            if (fetchRes.ok) {
              const rawOut = Buffer.from(await fetchRes.arrayBuffer());
              const watermarked = await addLuxuryWatermark(rawOut);

              return NextResponse.json({
                success: true,
                resultImage: `data:image/jpeg;base64,${watermarked.toString("base64")}`,
                engine: "Avoroni Haute Couture AI Neural Atelier",
                stylingTip,
                productName: { bn: productNameBn, en: productNameEn },
                category,
                isClientFit: true,
              });
            }
          }
        } catch (swapErr: any) {
          console.warn("Notice: Face swap secondary fallback:", swapErr.message);
        }

        // Secondary Fallback Engine for Sarees: IDM-VTON Neural Diffusion
        if (category === "saree") {
          const vtonClient = await Client.connect("yisol/IDM-VTON");
          const vtonRes: any = await vtonClient.predict("/tryon", [
            { background: sourceBlob, layers: [], composite: null },
            targetBlob,
            `Authentic ${productNameEn} saree, traditional royal Bengali handcrafted saree`,
            true,
            false,
            20,
            42
          ]);

          const vtonUrl = vtonRes?.data?.[0]?.url;
          if (vtonUrl) {
            const vtonFetch = await fetch(vtonUrl);
            if (vtonFetch.ok) {
              const rawVton = Buffer.from(await vtonFetch.arrayBuffer());
              const watermarked = await addLuxuryWatermark(rawVton);

              return NextResponse.json({
                success: true,
                resultImage: `data:image/jpeg;base64,${watermarked.toString("base64")}`,
                engine: "IDM-VTON Neural Garment Diffusion",
                stylingTip,
                productName: { bn: productNameBn, en: productNameEn },
                category,
                isClientFit: true,
              });
            }
          }
        }
      } catch (neuralErr: any) {
        console.error("Neural fitting error:", neuralErr.message);
        return NextResponse.json(
          {
            error: "এআই প্রসেসিং কিছুটা সময় নিচ্ছে। অনুগ্রহ করে কয়েক সেকেন্ড পর পুনরায় 'এআই দিয়ে বানিয়ে নিন' চাপুন।",
            isTimeout: true,
            success: false,
          },
          { status: 503 }
        );
      }
    }

    // =========================================================================
    // HAUTE COUTURE ATELIER SHOWCASE (Demo Model Mode)
    // =========================================================================
    const watermarked = await addLuxuryWatermark(targetBuffer);

    return NextResponse.json({
      success: true,
      resultImage: `data:image/jpeg;base64,${watermarked.toString("base64")}`,
      engine: "Avoroni Haute Couture AI Editorial Atelier",
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
