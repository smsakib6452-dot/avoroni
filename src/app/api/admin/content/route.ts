import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { DEFAULT_SITE_CONTENT, SiteContent } from "@/data/defaultContent";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

const DATA_FILE_PATH = path.join(process.cwd(), "src/data/siteContent.json");

function getLocalStoredContent(): SiteContent {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const raw = fs.readFileSync(DATA_FILE_PATH, "utf8");
      return JSON.parse(raw);
    }
  } catch (error) {
    console.warn("Could not read local siteContent.json, falling back:", error);
  }
  return DEFAULT_SITE_CONTENT;
}

export async function GET() {
  const supabase = getSupabase();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("site_content")
        .select("content")
        .eq("id", "active")
        .single();

      if (!error && data?.content) {
        return NextResponse.json(data.content, {
          headers: {
            "Cache-Control": "no-store, max-age=0",
          },
        });
      }
    } catch (err) {
      console.warn("Supabase site_content query failed, falling back to local file:", err);
    }
  }

  const content = getLocalStoredContent();
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

    let savedToCloud = false;
    const supabase = getSupabase();

    if (supabase) {
      try {
        const { error } = await supabase.from("site_content").upsert({
          id: "active",
          content: updatedContent,
          updated_at: new Date().toISOString(),
        });
        if (!error) {
          savedToCloud = true;
        } else {
          console.error("Supabase upsert error:", error);
        }
      } catch (cloudErr) {
        console.error("Supabase write exception:", cloudErr);
      }
    }

    // Try saving locally as well (for local development or sync)
    try {
      const tempPath = `${DATA_FILE_PATH}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(updatedContent, null, 2), "utf8");
      fs.renameSync(tempPath, DATA_FILE_PATH);
    } catch (fsErr) {
      // In serverless environments like Vercel, read-only fs error is expected and caught safely
      if (!savedToCloud) {
        console.warn("Local file write skipped or read-only:", fsErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: savedToCloud
        ? "Site content updated and synced to Supabase cloud"
        : "Site content updated successfully",
      timestamp: new Date().toISOString(),
      content: updatedContent,
      storage: savedToCloud ? "supabase" : "local",
    });
  } catch (error: any) {
    console.error("Error updating site content:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to save content" },
      { status: 500 }
    );
  }
}
