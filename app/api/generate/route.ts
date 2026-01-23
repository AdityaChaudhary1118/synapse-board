import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ status: "API is Online. Send a POST request to generate code." });
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Server Error: API Key missing" }, { status: 500 });
    }

    const body = await req.json();
    const { image } = body;
    if (!image) {
      return NextResponse.json({ error: "Client Error: No drawing sent" }, { status: 400 });
    }

    const modelsResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    
    if (!modelsResponse.ok) {
      throw new Error(`Failed to list models: ${modelsResponse.statusText}`);
    }

    const modelsData = await modelsResponse.json();
    const availableModels = modelsData.models || [];

    let targetModel = availableModels.find((m: any) => 
      m.name.includes("gemini-1.5-flash") && m.supportedGenerationMethods.includes("generateContent")
    );

    if (!targetModel) {
      targetModel = availableModels.find((m: any) => 
        m.name.includes("gemini") && m.supportedGenerationMethods.includes("generateContent")
      );
    }

    if (!targetModel) {
      throw new Error("Your API Key does not have access to ANY Gemini models. Please create a new Key.");
    }

    const modelName = targetModel.name.replace("models/", "");

    const payload = {
      contents: [{
        parts: [
          { text: "You are an expert frontend developer. Turn this wireframe drawing into a modern, responsive HTML file using Tailwind CSS. Return ONLY the HTML code. Do not wrap in markdown." },
          { text: `SVG Context: ${image}` }
        ]
      }]
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Google Refused (${modelName}): ${response.status}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!rawText) throw new Error("AI returned an empty response.");

    const cleanCode = rawText.replace(/```html|```/g, "").trim();

    return NextResponse.json({ code: cleanCode });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}