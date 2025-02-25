"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// 創建上下文
const AppContext = createContext({});

// 提供者組件
export function AppProvider({ children }) {
  const router = useRouter();

  // 狀態管理
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState("karen");
  const [selectedIndustry, setSelectedIndustry] = useState("technology");
  const [sessionScore, setSessionScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [chatMessages, setChatMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  // 保存會話歷史
  const [sessionHistory, setSessionHistory] = useState([]);

  // AI 服務密鑰
  const openAIKey = process.env.NEXT_PUBLIC_OPENAI_KEY || "";
  const geminiKey = process.env.NEXT_PUBLIC_GEMINI_KEY || "";

  // 初始化 - 從本地存儲加載數據
  useEffect(() => {
    const loadSavedData = () => {
      try {
        // 從localStorage加載數據（僅客戶端可用）
        if (typeof window !== "undefined") {
          const savedIsPremium = localStorage.getItem("isPremiumUser");
          if (savedIsPremium) setIsPremiumUser(JSON.parse(savedIsPremium));

          const savedCharacter = localStorage.getItem("selectedCharacter");
          if (savedCharacter) setSelectedCharacter(savedCharacter);

          const savedIndustry = localStorage.getItem("selectedIndustry");
          if (savedIndustry) setSelectedIndustry(savedIndustry);

          const savedHistory = localStorage.getItem("sessionHistory");
          if (savedHistory) setSessionHistory(JSON.parse(savedHistory));
        }
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    };

    loadSavedData();
  }, []);

  // 保存狀態到本地存儲
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("isPremiumUser", JSON.stringify(isPremiumUser));
      localStorage.setItem("selectedCharacter", selectedCharacter);
      localStorage.setItem("selectedIndustry", selectedIndustry);
      localStorage.setItem("sessionHistory", JSON.stringify(sessionHistory));
    }
  }, [isPremiumUser, selectedCharacter, selectedIndustry, sessionHistory]);

  // 啟動新面試
  const startNewInterview = () => {
    setChatMessages([]);
    setSessionScore(0);
    setCurrentRound(1);
    router.push("/chat");

    // 添加初始消息
    setTimeout(() => {
      const initialMessages = [
        {
          id: Date.now(),
          sender: isPremiumUser ? selectedCharacter : "hr",
          content: "Are you interview with us?",
          isUser: false,
          timestamp: new Date(),
        },
      ];
      setChatMessages(initialMessages);
    }, 500);
  };

  // 結束面試
  const endInterview = () => {
    // 創建新的會話記錄
    const newSession = {
      id: Date.now(),
      date: new Date(),
      character: selectedCharacter,
      industry: selectedIndustry,
      score: sessionScore,
      round: currentRound,
    };

    // 更新會話歷史
    setSessionHistory((prev) => [...prev, newSession]);

    // 導航到分數頁面
    router.push("/score");
  };

  // 發送消息到AI
  const sendMessage = async (content) => {
    if (!content.trim()) return;

    // 添加用戶消息
    const userMessage = {
      id: Date.now(),
      sender: "user",
      content,
      isUser: true,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setUserInput("");
    setIsProcessing(true);

    try {
      // 選擇使用哪個AI服務
      const apiEndpoint = isPremiumUser
        ? "/api/openai" // 付費用戶使用OpenAI
        : "/api/gemini"; // 免費用戶使用Gemini

      // 發送API請求
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          character: selectedCharacter,
          industry: selectedIndustry,
          round: currentRound,
        }),
      });

      if (!response.ok) {
        throw new Error("AI服務響應錯誤");
      }

      const data = await response.json();

      // 添加AI回應消息
      const aiMessage = {
        id: Date.now() + 1,
        sender: isPremiumUser ? selectedCharacter : "hr",
        content: data.response,
        isUser: false,
        timestamp: new Date(),
      };

      setChatMessages((prev) => [...prev, aiMessage]);

      // 更新分數
      if (data.score) {
        setSessionScore((prev) => prev + data.score);
      }
    } catch (error) {
      console.error("發送消息錯誤:", error);

      // 添加備用回應
      const fallbackMessage = {
        id: Date.now() + 1,
        sender: isPremiumUser ? selectedCharacter : "hr",
        content: "抱歉，我遇到了一些連接問題。你能再說一遍嗎？",
        isUser: false,
        timestamp: new Date(),
      };

      setChatMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  // 提供的上下文值
  const contextValue = {
    isPremiumUser,
    setIsPremiumUser,
    selectedCharacter,
    setSelectedCharacter,
    selectedIndustry,
    setSelectedIndustry,
    sessionScore,
    setSessionScore,
    currentRound,
    setCurrentRound,
    chatMessages,
    setChatMessages,
    isProcessing,
    setIsProcessing,
    userInput,
    setUserInput,
    isRecording,
    setIsRecording,
    sessionHistory,
    startNewInterview,
    endInterview,
    sendMessage,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

// 自定義鉤子，用於訪問上下文
export function useAppContext() {
  return useContext(AppContext);
}
