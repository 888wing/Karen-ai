"use client";

import { useState, useEffect } from "react";
import useSpeechRecognition from "./useSpeechRecognition";

/**
 * 語音識別與語言選擇的包裝鉤子
 * @returns {Object} 帶有語言選擇功能的語音識別
 */
const useSpeechLanguageSelector = () => {
  const [language, setLanguage] = useState("zh-TW"); // 默認使用繁體中文
  const speechRecognition = useSpeechRecognition();

  // 支持的語言
  const supportedLanguages = [
    { code: "zh-TW", name: "繁體中文" },
    { code: "zh-CN", name: "简体中文" },
    { code: "en-US", name: "English (US)" },
    { code: "ja-JP", name: "日本語" },
    // 可根據需要添加更多語言
  ];

  // 當語言變更時更新識別語言
  useEffect(() => {
    speechRecognition.changeLanguage(language);
  }, [language, speechRecognition]);

  // 變更語言
  const changeLanguage = (languageCode) => {
    if (supportedLanguages.some((lang) => lang.code === languageCode)) {
      setLanguage(languageCode);
    } else {
      console.warn(`不支持 ${languageCode} 語言`);
    }
  };

  return {
    ...speechRecognition,
    currentLanguage: language,
    supportedLanguages,
    changeLanguage,
  };
};

export default useSpeechLanguageSelector;
