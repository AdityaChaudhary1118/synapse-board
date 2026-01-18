import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 1. Skip all AI logic. Just prove the server works.
    console.log("Mock API hit!"); 

    // 2. Return fake HTML immediately
    const fakeHtml = `
      <!DOCTYPE html>
      <html>
        <body style="background: #f0f9ff; display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif;">
          <div style="text-align: center;">
            <h1 style="color: #0284c7; font-size: 3rem;">🎉 It Works!</h1>
            <p style="color: #64748b;">The server connection is perfect.</p>
            <p>The issue is strictly with the Google AI Library version.</p>
          </div>
        </body>
      </html>
    `;

    return NextResponse.json({ code: fakeHtml });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}