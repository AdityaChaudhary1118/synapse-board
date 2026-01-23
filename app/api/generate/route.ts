import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'; // Prevent static caching

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

    // 1. AUTO-DETECT MODEL
    const modelsResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    
    if (!modelsResponse.ok) {
        // Fallback if list fails
        console.error("Failed to list models, defaulting to gemini-pro");
    }
    
    const modelsData = modelsResponse.ok ? await modelsResponse.json() : { models: [] };
    const availableModels = modelsData.models || [];

    // Prioritize flash (fastest), then pro (standard)
    let targetModel = availableModels.find((m: any) => 
      m.name.includes("gemini-1.5-flash") && m.supportedGenerationMethods.includes("generateContent")
    );

    if (!targetModel) {
      targetModel = availableModels.find((m: any) => 
        m.name.includes("gemini") && m.supportedGenerationMethods.includes("generateContent")
      );
    }
    
    // Default to 'gemini-pro' if detection fails but key is valid
    const modelName = targetModel ? targetModel.name.replace("models/", "") : "gemini-pro";

    // 2. HARDENED PROMPT: Explicitly demand Tailwind CDN
    const payload = {
      contents: [{
        parts: [
          { text: `
            You are an expert frontend developer. 
            Turn this wireframe drawing into a modern, responsive HTML file using Tailwind CSS. 
            
            CRITICAL RULES:
            1. You MUST include <script src="https://cdn.tailwindcss.com"></script> in the <head>.
            2. Use beautiful gradients, shadows, and rounded corners.
            3. Return ONLY the HTML code. Do not wrap in markdown or backticks.
            ` 
          },
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

    // 3. CLEAN & INJECT: Ensure Tailwind is present even if AI forgot
    let cleanCode = rawText.replace(/```html|```/g, "").trim();
    
    // Safety Net: If the AI forgot the script, we inject it manually
    if (!cleanCode.includes("cdn.tailwindcss.com")) {
        cleanCode = cleanCode.replace("<head>", '<head><script src="https://cdn.tailwindcss.com"></script>');
    }

    return NextResponse.json({ code: cleanCode });

  } catch (error: any) {
    console.error("Route Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}