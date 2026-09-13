import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { DEFAULT_SITE_CONTENT } from "@/data/defaultContent";

const DATA_FILE_PATH = path.join(process.cwd(), "src/data/siteContent.json");

export async function POST() {
  try {
    fs.writeFileSync(
      DATA_FILE_PATH,
      JSON.stringify(DEFAULT_SITE_CONTENT, null, 2),
      "utf8"
    );

    return NextResponse.json({
      success: true,
      message: "Site content reset to factory defaults successfully",
      content: DEFAULT_SITE_CONTENT,
    });
  } catch (error) {
    console.error("Error resetting siteContent.json:", error);
    return NextResponse.json(
      { error: "Failed to reset site content" },
      { status: 500 }
    );
  }
}
