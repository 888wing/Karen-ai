"use client";

import { useState } from "react";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import useSpeechSynthesis from "../hooks/useSpeechSynthesis";

const ChatBubble = ({ message }) => {
  const { isUser, content, sender, timestamp } = message;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { speak, cancel, speaking, supported } = useSpeechSynthesis();

  // 格式化時間戳
  const formatTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // 切換語音
  const toggleSpeech = () => {
    if (isSpeaking) {
      cancel();
      setIsSpeaking(false);
    } else {
      speak(content);
      setIsSpeaking(true);
    }
  };

  // 當語音結束時停止播放狀態
  if (!speaking && isSpeaking) {
    setIsSpeaking(false);
  }

  return (
    <div className={`flex items-start ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <div className="w-8 h-8 bg-gray-300 rounded-full mr-2 flex-shrink-0 overflow-hidden">
          <img
            src={`/images/${sender}.png`}
            alt={sender}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/default-avatar.png";
            }}
          />
        </div>
      )}

      <div
        className={`relative rounded-lg px-4 py-2 max-w-[70%] ${
          isUser ? "bg-[#E6AA63] text-white" : "bg-[#F7DAA0] bg-opacity-50"
        }`}
      >
        <div className="flex flex-col">
          {!isUser && (
            <div className="text-xs text-gray-600 mb-1">{sender}</div>
          )}
          <div className="whitespace-pre-wrap break-words">{content}</div>
          <div className="text-xs text-right mt-1 text-gray-500">
            {formatTime(timestamp)}
          </div>
        </div>

        {/* 語音按鈕 - 僅用於AI消息 */}
        {!isUser && supported && (
          <button
            onClick={toggleSpeech}
            className={`absolute -left-10 top-1/2 transform -translate-y-1/2 p-2 rounded-full ${
              isSpeaking ? "text-red-500" : "text-gray-500"
            } hover:bg-gray-200`}
            aria-label={isSpeaking ? "停止語音" : "朗讀消息"}
          >
            {isSpeaking ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 bg-blue-500 rounded-full ml-2 flex-shrink-0 flex items-center justify-center text-white text-sm">
          您
        </div>
      )}
    </div>
  );
};

export default ChatBubble;
