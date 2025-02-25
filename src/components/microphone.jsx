"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Microphone({ onActivate }) {
  const [scale, setScale] = useState(1);

  const handleClick = () => {
    setScale(1.2);

    // 動畫完成後觸發回調
    setTimeout(() => {
      setScale(1);
      setTimeout(() => {
        onActivate();
      }, 300);
    }, 300);
  };

  return (
    <motion.button
      onClick={handleClick}
      className="relative w-40 h-40 bg-[#E6AA63] rounded-full flex items-center justify-center outline-none focus:outline-none"
      animate={{ scale }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <motion.div className="text-5xl" animate={{ scale: scale * 0.9 }}>
        🎤
      </motion.div>
    </motion.button>
  );
}
