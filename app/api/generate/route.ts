import { NextResponse } from "next/server";

// NOTICE: No "import { GoogleGenerativeAI }" here. 
// If you see that import, DELETE IT.

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API Key missing. Check Vercel Env Vars." }, { status: 500 });
    }

    const body = await req.json();
    const { image } = body;
    if (!image) {
      return NextResponse.json({ error: "No image data received" }, { status: 400 });
    }

    const payload = {
      contents: [
        {
          parts: [
            { text: "You are an expert frontend developer. Convert this SVG wireframe into a single HTML file with Tailwind CSS. Make it look modern. Return ONLY raw HTML code (no markdown)." },
            { text: `SVG Code: ${image}` }
          ]
        }
      ]
    };

    // We use 'gemini-pro' here as it is the most stable model
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Google API Error:", errorData);
      return NextResponse.json({ error: `Google Refused: ${response.status} ${response.statusText}` }, { status: response.status });
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!rawText) throw new Error("AI returned an empty response.");

    const cleanCode = rawText.replace(/```html|```/g, "").trim();

    return NextResponse.json({ code: cleanCode });

  } catch (error: any) {
    console.error("Server Crash:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}