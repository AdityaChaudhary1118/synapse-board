import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// 1. Initialize Gemini
// We check if the key exists to avoid crashing blindly
const apiKey = process.env.GEMINI_GENERATIVE_AI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(req: Request) {
  try {
    // 2. Security Check
    if (!genAI) {
      return NextResponse.json(
        { error: "API Key missing on server. Please add GEMINI_API_KEY to Vercel env vars." },
        { status: 500 }
      );
    }

    // 3. Get the drawing from the button
    const body = await req.json();
    const { image } = body; // This is the SVG string

    if (!image) {
      return NextResponse.json({ error: "No image data received" }, { status: 400 });
    }

    // 4. Prepare the AI Model (Gemini 1.5 Flash is fast and good for code)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 5. The Prompt (Instructions for the AI)
    const prompt = `
      You are an expert frontend developer.
      I am sending you an SVG code representation of a wireframe I drew.
      
      Your task:
      1. Look at the SVG structure to understand the layout, text, and shapes.
      2. Write a single HTML file containing the structure and Tailwind CSS classes to reproduce this design.
      3. Make it look modern, clean, and professional.
      4. Return ONLY the HTML code. Do not wrap it in markdown blocks (no \`\`\`html).
      
      Here is the SVG:
      ${image}
    `;

    // 6. Generate!
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const code = response.text();

    // 7. Send the code back to the browser
    return NextResponse.json({ code });

  } catch (error: any) {
    console.error("AI Generation Failed:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}