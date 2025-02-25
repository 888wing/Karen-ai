# Karen AI - 面試教練應用

Karen AI是一個互動式面試練習應用，幫助用戶通過與帶有獨特個性的AI面試官進行模擬面試來提升面試技巧。

## 功能

- **多種HR角色**: 從挑剔的Karen到直接的Steve，冷靜的Linda和古怪的Bob
- **量身定制的行業**: 根據不同行業調整面試問題
- **實時語音識別**: 支持語音回答面試問題
- **AI驅動的回應**: 使用OpenAI (GPT-4o) 和 Google Gemini API
- **評分與反饋**: 獲得面試表現的詳細評分和反饋
- **移動優先設計**: 專為手機用戶優化的用戶界面

## 技術堆棧

- **前端**: Next.js、React、TailwindCSS、Framer Motion
- **API**: OpenAI API、Google Gemini API
- **語音**: Web Speech API (SpeechRecognition)
- **部署**: Replit

## 開始使用

### 先決條件

- Node.js (推薦 v18+)
- OpenAI API 密鑰
- Google Gemini API 密鑰

### 安裝

1. 克隆項目或在Replit上創建

2. 安裝依賴
   ```bash
   npm install
   ```

3. 創建 `.env.local` 文件並添加您的API密鑰
   ```
   OPENAI_API_KEY=your_openai_api_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. 啟動開發服務器
   ```bash
   npm run dev
   ```

5. 打開 [http://localhost:3000](http://localhost:3000) 查看應用

## 使用指南

1. **開始面試**:
   - 在主頁點擊麥克風按鈕
   - 高級用戶可以選擇行業和HR角色

2. **回答問題**:
   - 使用文本輸入或語音輸入回答問題
   - 點擊發送按鈕提交回答

3. **查看結果**:
   - 完成面試後查看您的分數和評論
   - 高級用戶可以看到更詳細的分析

## 許可證

本項目僅供學習和教育目的使用。

## 致謝

- 感謝OpenAI和Google提供的強大AI API
- 感謝所有幫助測試和改進此應用的人

---

Made with ❤️ for interview practice