import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(req: Request) {
  try {
    if (!genAI) return NextResponse.json({ error: "Key missing" }, { status: 500 });

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // TEST: Ignore the image, just test the connection
    const prompt = "Write a simple HTML file that says 'Hello World' in a blue h1 tag.";

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const code = response.text();

    return NextResponse.json({ code });

  } catch (error: any) {
    console.error("Test Failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}