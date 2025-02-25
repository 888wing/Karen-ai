// app/api/gemini/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { message, industry, round } = await request.json();

    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      return NextResponse.json(
        { error: "API key is not configured" },
        { status: 500 },
      );
    }

    // 構建行業和回合提示
    const industryPrompt = `The interview is for a position in the ${industry} industry.`;

    let roundPrompt = "";
    switch (round) {
      case 1:
        roundPrompt = "This is an initial screening round.";
        break;
      case 2:
        roundPrompt = "This is a technical round.";
        break;
      case 3:
        roundPrompt = "This is a final round with a panel.";
        break;
      default:
        roundPrompt = "This is a standard interview round.";
    }

    // 構建完整提示
    const prompt = `You are a professional HR interviewer. ${industryPrompt} ${roundPrompt} The candidate said: "${message}". Provide a professional response as an interviewer. Keep it under 80 words.`;

    // 調用 Gemini API
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 250,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API Error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();

    let aiResponse = "";
    if (
      data.candidates &&
      data.candidates.length > 0 &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts.length > 0
    ) {
      aiResponse = data.candidates[0].content.parts[0].text;
    } else {
      aiResponse =
        "I'm sorry, I couldn't process your response. Could you please elaborate more on your experience?";
    }

    // 簡單的評分系統（對免費用戶更簡單）
    const score = Math.floor(Math.random() * 30) + 30; // 30-59 基礎分數

    return NextResponse.json({
      response: aiResponse,
      score,
    });
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { error: "Failed to process your request" },
      { status: 500 },
    );
  }
}
