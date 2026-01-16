import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    const data = await req.json();

    // We use the model found in your list: 'gemini-2.0-flash'
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: "Look at this drawing. Write the HTML/Tailwind CSS code to make it a real website. Return ONLY the code, no markdown, no ```html tags." },
                {
                  inline_data: {
                    mime_type: "image/png",
                    data: data.image.split(",")[1] 
                  }
                }
              ]
            }
          ]
        })
      }
    );

    if (!response.ok) {
       const errorText = await response.text();
       console.error("Google Error:", errorText);
       throw new Error(`Google refused: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    // Gemini 2.0 structure is the same, this will work:
    const text = result.candidates[0].content.parts[0].text;
    
    return new NextResponse(text);

  } catch (error: any) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}