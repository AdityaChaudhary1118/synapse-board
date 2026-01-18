import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  const hasKey = !!process.env.GEMINI_API_KEY;
  
  return NextResponse.json({
    status: "Online",
    message: "If you can read this, the server updated successfully.",
    key_status: hasKey ? "✅ API Key Found" : "❌ API Key Missing",
    timestamp: new Date().toISOString()
  });
}