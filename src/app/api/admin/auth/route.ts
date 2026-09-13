import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { DEFAULT_SITE_CONTENT } from "@/data/defaultContent";

const DATA_FILE_PATH = path.join(process.cwd(), "src/data/siteContent.json");

export async function POST(request: Request) {
  try {
    const { passcode } = await request.json();

    let targetPasscode = DEFAULT_SITE_CONTENT.brand.adminPasscode;

    if (fs.existsSync(DATA_FILE_PATH)) {
      try {
        const raw = fs.readFileSync(DATA_FILE_PATH, "utf8");
        const json = JSON.parse(raw);
        if (json.brand?.adminPasscode) {
          targetPasscode = json.brand.adminPasscode;
        }
      } catch (e) {}
    }

    if (passcode === targetPasscode) {
      return NextResponse.json({ success: true, message: "Authorized" });
    } else {
      return NextResponse.json(
        { success: false, error: "Incorrect admin passcode" },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Authentication check failed" },
      { status: 500 }
    );
  }
}
