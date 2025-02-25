// app/api/openai/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { message, character, industry, round } = await request.json();

    const openAIKey = process.env.OPENAI_API_KEY;
    if (!openAIKey) {
      return NextResponse.json(
        { error: "API key is not configured" },
        { status: 500 },
      );
    }

    // 創建角色描述
    let characterPrompt = "";
    switch (character) {
      case "karen":
        characterPrompt =
          "You are Karen, a picky and detail-oriented HR interviewer. You're known for nitpicking every detail and being a bit sassy and harsh, but fair.";
        break;
      case "steve":
        characterPrompt =
          "You are Steve, an HR interviewer who values conciseness. You like direct answers and dislike unnecessary details or rambling.";
        break;
      case "linda":
        characterPrompt =
          "You are Linda, a pleasant but challenging HR interviewer. You ask tough questions with a smile, always being polite but probing.";
        break;
      case "bob":
        characterPrompt =
          "You are Bob, an unconventional HR interviewer who asks unexpected questions to see how candidates think on their feet.";
        break;
      default:
        characterPrompt =
          "You are a professional HR interviewer conducting a job interview.";
    }

    // 創建行業描述
    let industryPrompt = `The interview is for a position in the ${industry} industry.`;

    // 創建回合描述
    let roundPrompt = "";
    switch (round) {
      case 1:
        roundPrompt =
          "This is an initial screening round. Ask basic questions about the candidate's background and experience.";
        break;
      case 2:
        roundPrompt =
          "This is a technical round. Ask more specific questions related to the candidate's skills and expertise in their field.";
        break;
      case 3:
        roundPrompt =
          "This is a final round with a panel. Ask challenging questions to assess cultural fit and long-term potential.";
        break;
      default:
        roundPrompt = "This is a standard interview round.";
    }

    // 構建完整提示
    const systemPrompt = `${characterPrompt} ${industryPrompt} ${roundPrompt} Keep your responses under 80 words and in character.`;

    // 調用 OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAIKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API Error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // 簡單的評分系統 - 在實際應用中可以更複雜
    let score = Math.floor(Math.random() * 40) + 30; // 30-69 基礎分數

    // 基於一些關鍵詞提高分數
    const positiveKeywords = [
      "experience",
      "skill",
      "project",
      "success",
      "achieve",
      "learn",
      "improve",
      "team",
      "collaborate",
      "lead",
    ];
    positiveKeywords.forEach((keyword) => {
      if (message.toLowerCase().includes(keyword)) {
        score += 3; // 每個關鍵詞加3分
      }
    });

    // 確保分數不超過100
    score = Math.min(score, 100);

    return NextResponse.json({
      response: aiResponse,
      score,
    });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      { error: "Failed to process your request" },
      { status: 500 },
    );
  }
}
