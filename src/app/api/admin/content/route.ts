import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { DEFAULT_SITE_CONTENT, SiteContent } from "@/data/defaultContent";

const DATA_FILE_PATH = path.join(process.cwd(), "src/data/siteContent.json");

function getStoredContent(): SiteContent {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const raw = fs.readFileSync(DATA_FILE_PATH, "utf8");
      return JSON.parse(raw);
    }
  } catch (error) {
    console.error("Error reading siteContent.json, falling back to default:", error);
  }
  return DEFAULT_SITE_CONTENT;
}

export async function GET() {
  const content = getStoredContent();
  return NextResponse.json(content, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

export async function POST(request: Request) {
  try {
    const updatedContent = await request.json();
    
    // Basic validation: ensure main sections exist
    if (!updatedContent.hero || !updatedContent.regionalSarees) {
      return NextResponse.json(
        { error: "Invalid content structure. Missing required sections." },
        { status: 400 }
      );
    }

    // Atomic write
    const tempPath = `${DATA_FILE_PATH}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(updatedContent, null, 2), "utf8");
    fs.renameSync(tempPath, DATA_FILE_PATH);

    return NextResponse.json({
      success: true,
      message: "Site content updated successfully",
      timestamp: new Date().toISOString(),
      content: updatedContent,
    });
  } catch (error) {
    console.error("Error writing siteContent.json:", error);
    return NextResponse.json(
      { error: "Failed to save content to disk" },
      { status: 500 }
    );
  }
}
