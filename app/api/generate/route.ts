import { NextResponse } from "next/server";

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

    const payload = {
      contents: [{
        parts: [
          { text: "You are an expert frontend developer. Turn this wireframe drawing into a modern, responsive HTML file using Tailwind CSS. Return ONLY the HTML code. Do not wrap in markdown." },
          { text: `SVG Context: ${image}` }
        ]
      }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 4096,
      }
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `Google Error: ${response.status} ${response.statusText}`;
      return NextResponse.json({ error: errorMessage }, { status: response.status });
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