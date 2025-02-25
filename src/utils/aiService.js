/**
 * AI服務工具函數
 * 處理與AI API的通信和錯誤處理
 */

// 獲取隨機評論
export const getRandomComment = (
  score,
  character = "karen",
  isPremium = false,
) => {
  if (!isPremium) {
    // 非高級用戶的標準評論
    if (score > 80) {
      return "You did very well in this interview. Keep up the good work!";
    } else if (score > 60) {
      return "Your answers were good but could use more specific examples.";
    } else {
      return "You need more preparation. Try focusing on more concise answers.";
    }
  }

  // 高級用戶的角色特定評論
  switch (character) {
    case "karen":
      if (score > 80) {
        return "Well, I'm surprised. You actually did better than most people I interview. Still some areas to improve though.";
      } else if (score > 60) {
        return "Hmm, not terrible but not impressive either. I've seen better preparation from candidates.";
      } else {
        return "That was... disappointing. If this were a real interview, I'd have cut it short.";
      }

    case "steve":
      if (score > 80) {
        return "Good. Concise. To the point. Exactly what I look for.";
      } else if (score > 60) {
        return "Too wordy. Cut the fluff. Focus on achievements.";
      } else {
        return "Unclear answers. Rambling. Restructure your thoughts.";
      }

    case "linda":
      if (score > 80) {
        return "I really enjoyed our conversation! Your answers showed depth and thoughtfulness. Just a few small areas to polish.";
      } else if (score > 60) {
        return "You have potential, but I'd like to see more concrete examples in your answers next time.";
      } else {
        return "I appreciate your effort, but I think you need more preparation before a real interview.";
      }

    case "bob":
      if (score > 80) {
        return "Fantastic! Your answers were like a perfectly ripe avocado - both substantial and surprising!";
      } else if (score > 60) {
        return "Hmm... like a sandwich without enough filling. The structure is there, but needs more meat.";
      } else {
        return "That was like trying to build IKEA furniture without instructions. Confusing and ultimately unsuccessful.";
      }

    default:
      return "Thank you for completing the interview. Keep practicing!";
  }
};

// 計算得分評論類別
export const getScoreCategory = (score) => {
  if (score >= 80) return "excellent";
  if (score >= 70) return "good";
  if (score >= 60) return "average";
  if (score >= 50) return "below_average";
  return "poor";
};

// 從API回應中提取文本
export const extractTextFromResponse = (
  apiResponse,
  defaultText = "I couldn't process your response. Could you try again?",
) => {
  try {
    // 處理不同的API回應格式
    if (typeof apiResponse === "string") {
      return apiResponse;
    }

    if (apiResponse?.choices?.[0]?.message?.content) {
      // OpenAI格式
      return apiResponse.choices[0].message.content;
    }

    if (apiResponse?.candidates?.[0]?.content?.parts?.[0]?.text) {
      // Gemini格式
      return apiResponse.candidates[0].content.parts[0].text;
    }

    return defaultText;
  } catch (error) {
    console.error("Error extracting text from API response:", error);
    return defaultText;
  }
};

// 格式化時間戳
export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};
