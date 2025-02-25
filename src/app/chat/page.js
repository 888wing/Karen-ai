"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMicrophone, FaStop, FaPaperPlane } from "react-icons/fa";
import { IoLanguage } from "react-icons/io5";
import { useAppContext } from "../../context/AppContext";
import BottomNavbar from "../../components/BottomNavbar";
import ChatBubble from "../../components/ChatBubble";
import useSpeechLanguageSelector from "../../hooks/useSpeechLanguageSelector";
import SpeechDebug from "../../components/SpeechDebug";

export default function ChatPage() {
  const {
    chatMessages,
    isProcessing,
    userInput,
    setUserInput,
    isRecording,
    setIsRecording,
    sendMessage,
    endInterview,
  } = useAppContext();

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  // 使用增強的語音識別鉤子
  const {
    transcript,
    startListening,
    stopListening,
    listening,
    browserSupport,
    currentLanguage,
    supportedLanguages,
    changeLanguage,
    resetTranscript,
  } = useSpeechLanguageSelector();

  // 當轉錄文本更新時，更新輸入框
  useEffect(() => {
    if (transcript) {
      setUserInput(transcript);
    }
  }, [transcript, setUserInput]);

  // 控制錄音狀態
  useEffect(() => {
    if (isRecording && browserSupport) {
      startListening();
    } else if (!isRecording && listening) {
      stopListening();
    }
  }, [isRecording, browserSupport, listening, startListening, stopListening]);

  // 滾動到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isProcessing]);

  // 當未錄音時聚焦輸入框
  useEffect(() => {
    if (!isRecording && !isProcessing) {
      inputRef.current?.focus();
    }
  }, [isRecording, isProcessing]);

  // 切換語音識別
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      stopListening();
    } else {
      setIsRecording(true);
      setUserInput("");
      resetTranscript();
      startListening();
    }
  };

  // 發送消息
  const handleSendMessage = () => {
    if (userInput.trim() && !isProcessing) {
      sendMessage(userInput);
      resetTranscript();
    }
  };

  // 處理輸入提交
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();
  };

  // 切換語言選擇器
  const toggleLanguageSelector = () => {
    setShowLanguageSelector(!showLanguageSelector);
  };

  // 處理語言變更
  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode);
    setShowLanguageSelector(false);
  };

  // 不支持的瀏覽器提示
  const renderBrowserNotSupported = () => {
    if (!browserSupport) {
      return (
        <div className="text-red-500 text-xs mt-1 text-center">
          此瀏覽器不支持語音識別。請嘗試使用 Chrome、Edge 或 Safari。
        </div>
      );
    }
    return null;
  };

  // 語音動畫
  const renderSpeechAnimation = () => {
    if (isRecording) {
      return (
        <motion.div
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-red-500 bg-opacity-40 p-4 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-16 h-16 flex items-center justify-center">
            <FaMicrophone className="text-white text-2xl" />
          </div>
        </motion.div>
      );
    }
    return null;
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#FEF9E3]">
      {/* 頂部欄 */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden">
          <img
            src="/images/profile.png"
            alt="Profile"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/40";
            }}
          />
        </div>

        {/* 語言選擇按鈕 */}
        <button
          onClick={toggleLanguageSelector}
          className="flex items-center gap-1 text-gray-700 px-3 py-1 rounded-full bg-gray-100"
        >
          <IoLanguage />
          <span className="text-sm">{currentLanguage.split("-")[0]}</span>
        </button>

        <button className="text-2xl">☰</button>
      </div>

      {/* 語言選擇下拉選單 */}
      {showLanguageSelector && (
        <div className="absolute right-4 top-16 bg-white shadow-lg rounded-lg p-2 z-10">
          {supportedLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`block w-full text-left px-4 py-2 rounded hover:bg-gray-100 ${
                currentLanguage === lang.code ? "bg-blue-100" : ""
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}

      {/* 聊天區域 */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence>
          {chatMessages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-4"
            >
              <ChatBubble message={message} />
            </motion.div>
          ))}

          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start mb-4"
            >
              <div className="w-8 h-8 bg-gray-300 rounded-full mr-2 flex-shrink-0"></div>
              <div className="bg-[#F7DAA0] bg-opacity-50 rounded-lg px-4 py-2 max-w-[70%]">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* 語音動畫 */}
      {renderSpeechAnimation()}

      {/* 輸入區域 */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        {renderBrowserNotSupported()}

        <div className="flex items-center space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={isRecording ? "正在聆聽..." : "輸入訊息..."}
            className={`flex-1 bg-white bg-opacity-20 rounded-full px-4 py-2 border ${
              isRecording ? "border-red-500 animate-pulse" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            disabled={isProcessing || isRecording}
          />

          <button
            type="button"
            onClick={toggleRecording}
            className={`rounded-full p-3 ${
              isRecording ? "bg-red-500" : "bg-blue-500"
            } text-white transition-colors duration-300`}
            disabled={isProcessing || !browserSupport}
            title={isRecording ? "停止錄音" : "開始錄音"}
          >
            {isRecording ? <FaStop /> : <FaMicrophone />}
          </button>

          <button
            type="submit"
            className={`rounded-full p-3 ${
              !userInput.trim() || isProcessing || isRecording
                ? "bg-gray-400"
                : "bg-green-500"
            } text-white transition-colors duration-300`}
            disabled={!userInput.trim() || isProcessing || isRecording}
            title="發送消息"
          >
            <FaPaperPlane />
          </button>
        </div>

        <button
          type="button"
          onClick={endInterview}
          className="w-full bg-green-500 text-white rounded-lg py-3 mt-4 font-medium hover:bg-green-600 transition-colors duration-300"
        >
          結束面試
        </button>
      </form>

      {/* 底部導航欄 */}
      <BottomNavbar />

      {/* 調試工具（開發階段使用） */}
      {showDebug && (
        <SpeechDebug
          isRecording={isRecording}
          transcript={transcript}
          browserSupport={browserSupport}
          currentLanguage={currentLanguage}
        />
      )}
    </main>
  );
}
