"use client";

import { useState } from "react";
import { HiOutlineChevronDown, HiOutlineChevronUp } from "react-icons/hi";

/**
 * 語音識別調試組件
 * 顯示語音識別狀態、轉錄文本等詳細信息
 */
const SpeechDebug = ({
  isRecording,
  transcript,
  browserSupport,
  currentLanguage,
  speechSynthesisSupported,
  selectedVoice,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 bg-gray-800 text-white p-2 rounded-full shadow-lg z-50"
        title="顯示語音調試"
      >
        <HiOutlineChevronUp className="text-lg" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 bg-white rounded-lg shadow-lg p-4 w-72 z-50 text-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">語音調試</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <HiOutlineChevronDown className="text-lg" />
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span>識別支持:</span>
          <span className={browserSupport ? "text-green-500" : "text-red-500"}>
            {browserSupport ? "是" : "否"}
          </span>
        </div>

        <div className="flex justify-between">
          <span>合成支持:</span>
          <span
            className={
              speechSynthesisSupported ? "text-green-500" : "text-red-500"
            }
          >
            {speechSynthesisSupported ? "是" : "否"}
          </span>
        </div>

        <div className="flex justify-between">
          <span>錄音:</span>
          <span className={isRecording ? "text-green-500" : "text-gray-500"}>
            {isRecording ? "進行中" : "未啟動"}
          </span>
        </div>

        <div className="flex justify-between">
          <span>語言:</span>
          <span>{currentLanguage}</span>
        </div>

        {selectedVoice && (
          <div className="flex justify-between">
            <span>語音:</span>
            <span className="truncate ml-2" title={selectedVoice.name}>
              {selectedVoice.name}
            </span>
          </div>
        )}

        <div>
          <span>轉錄文本:</span>
          <div className="mt-1 p-2 bg-gray-100 rounded text-xs max-h-20 overflow-y-auto">
            {transcript || <em className="text-gray-400">無轉錄內容</em>}
          </div>
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-500">
        僅供開發階段使用。正式版本中請移除。
      </div>
    </div>
  );
};

export default SpeechDebug;
