import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { apiKey } = await req.json();
    const key = (apiKey || process.env.GEMINI_API_KEY || "").trim();

    if (!key) {
      return NextResponse.json(
        { success: false, message: "কোনো API Key প্রদান করা হয়নি।" },
        { status: 400 }
      );
    }

    const candidateModels = ["gemini-3.5-flash", "gemini-3.6-flash", "gemini-3.7-flash", "gemini-flash-latest"];
    let lastError = "";

    for (const model of candidateModels) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": key,
          },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: "Hello" }] }],
          }),
        });

        const data = await res.json();

        if (res.ok && data?.candidates?.[0]?.content) {
          return NextResponse.json({
            success: true,
            model,
            message: `Google Gemini সফলভাবে সংযুক্ত হয়েছে! মডেল: ${model}`,
          });
        }

        if (data?.error?.message) {
          lastError = data.error.message;
          if (data.error.code === 403) {
            return NextResponse.json({
              success: false,
              code: 403,
              message: `গুগল ক্লাউড নোটিশ (403): ${data.error.message}। সমাধান: aistudio.google.com/apikey এ গিয়ে 'Create API key in new project' নির্বাচন করে নতুন কি তৈরি করুন।`,
            });
          }
        }
      } catch (err: any) {
        lastError = err.message;
      }
    }

    return NextResponse.json({
      success: false,
      message: `কানেকশন ব্যর্থ হয়েছে: ${lastError || "Unknown error"}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to test Gemini key" },
      { status: 500 }
    );
  }
}
