import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(req: Request) {
  try {
    if (!genAI) return NextResponse.json({ error: "API Key missing" }, { status: 500 });

    const body = await req.json();
    const { image } = body;

    if (!image) return NextResponse.json({ error: "No image data" }, { status: 400 });

    // 1. Use the Flash model (Fast & Smart)
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
    });

    // 2. The Prompt
    const prompt = `
      You are an expert frontend developer.
      I am sending you an SVG code representation of a wireframe.
      
      Task:
      1. Analyze the SVG structure.
      2. Write a single HTML file with Tailwind CSS to recreate this UI.
      3. Make it look modern, clean, and professional.
      4. Return ONLY the raw HTML code. Do not use markdown backticks.

      SVG Context:
      ${image}
    `;

    // 3. Generate
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const code = response.text().replace(/```html|```/g, "").trim();

    return NextResponse.json({ code });

  } catch (error: any) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: error.message || "AI Failed" }, { status: 500 });
  }
}