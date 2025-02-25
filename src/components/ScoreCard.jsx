import { motion } from 'framer-motion';

export default function ScoreCard({ title, score }) {
  // 確保分數在0-100範圍內
  const normalizedScore = Math.max(0, Math.min(100, score));

  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium">{title}</span>
        <span className="text-sm font-medium">{normalizedScore}%</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <motion.div
          className="h-2.5 rounded-full bg-blue-600"
          style={{ width: '0%' }}
          animate={{ width: `${normalizedScore}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        ></motion.div>
      </div>
    </div>
  );
}