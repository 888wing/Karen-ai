                'use client';

                import { useRouter } from 'next/navigation';
                import { useEffect, useState } from 'react';
                import { motion } from 'framer-motion';
                import { FaTimes } from 'react-icons/fa';
                import { useAppContext } from '@/context/AppContext';
                import BottomNavbar from '@/components/BottomNavbar';
                import ScoreCard from '@/components/ScoreCard';

                export default function ScorePage() {
                  const router = useRouter();
                  const { 
                    sessionScore, 
                    selectedCharacter,
                    isPremiumUser
                  } = useAppContext();

                  const [showScore, setShowScore] = useState(false);
                  const [showChart, setShowChart] = useState(false);
                  const [showComment, setShowComment] = useState(false);

                  // 漸進顯示各元素
                  useEffect(() => {
                    const timer1 = setTimeout(() => setShowScore(true), 500);
                    const timer2 = setTimeout(() => setShowChart(true), 1000);
                    const timer3 = setTimeout(() => setShowComment(true), 1500);

                    return () => {
                      clearTimeout(timer1);
                      clearTimeout(timer2);
                      clearTimeout(timer3);
                    };
                  }, []);

                  // 獲取AI評論
                  const getComment = () => {
                    if (sessionScore > 80) {
                      return isPremiumUser 
                        ? "Impressive performance! You've clearly prepared well, but there's always room for fine-tuning your answers."
                        : "You did very well in this interview. Keep up the good work!";
                    } else if (sessionScore > 60) {
                      return isPremiumUser
                        ? "Not bad, but I expected more. Your answers were adequate but lacked the depth I was looking for."
                        : "Your answers were good but could use more specific examples.";
                    } else {
                      return isPremiumUser
                        ? "Frankly, that was disappointing. If this were a real interview, you wouldn't make it to the next round."
                        : "You need more preparation. Try focusing on more concise answers.";
                    }
                  };

                  return (
                    <main className="flex min-h-screen flex-col bg-[#FEF9E3]">
                      {/* 頂部欄 */}
                      <div className="flex justify-end p-4">
                        <button 
                          onClick={() => router.push('/')}
                          className="text-2xl"
                        >
                          <FaTimes />
                        </button>
                      </div>

                      {/* 分數區域 */}
                      <div className="flex-1 p-4">
                        <div className="text-center mb-8">
                          <h2 className="text-lg font-medium">Score</h2>

                          <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: showScore ? 1 : 0.5, opacity: showScore ? 1 : 0 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                          >
                            <h1 className="text-5xl font-bold">{sessionScore}/100</h1>
                          </motion.div>

                          <p className="text-sm text-gray-500 mt-2">Leading 10,952 on world</p>
                        </div>

                        {/* 表現追蹤 */}
                        <div className="mb-8">
                          <h3 className="text-lg font-medium mb-2">Track Record</h3>

                          <div className="border border-black rounded-lg overflow-hidden h-48 relative">
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: showChart ? 1 : 0 }}
                              transition={{ duration: 0.5 }}
                              className="absolute inset-0 p-4"
                            >
                              <svg viewBox="0 0 100 50" className="w-full h-full">
                                <motion.path
                                  d="M0 50 L10 40 L20 30 L30 35 L40 25 L50 15 L60 20 L70 10 L80 25 L90 35 L100 40"
                                  fill="none"
                                  stroke="black"
                                  strokeWidth="1"
                                  initial={{ pathLength: 0 }}
                                  animate={{ pathLength: showChart ? 1 : 0 }}
                                  transition={{ duration: 1.5, ease: "easeInOut" }}
                                />
                              </svg>
                            </motion.div>
                          </div>
                        </div>

                        {/* 評論 */}
                        <div>
                          <h3 className="text-lg font-medium mb-2">Comment from {selectedCharacter}</h3>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: showComment ? 1 : 0, y: showComment ? 0 : 20 }}
                            transition={{ duration: 0.5 }}
                            className="bg-[#F7DAA0] rounded-lg p-4"
                          >
                            <p>{getComment()}</p>
                          </motion.div>
                        </div>

                        {/* 高級用戶額外分析 */}
                        {isPremiumUser && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: showComment ? 1 : 0, y: showComment ? 0 : 20 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="mt-6"
                          >
                            <h3 className="text-lg font-medium mb-2">Detailed Analysis</h3>

                            <div className="bg-white bg-opacity-50 rounded-lg p-4">
                              <ScoreCard title="Communication" score={sessionScore - 5} />
                              <ScoreCard title="Technical Knowledge" score={sessionScore + 3} />
                              <ScoreCard title="Cultural Fit" score={sessionScore - 2} />
                              <ScoreCard title="Problem Solving" score={sessionScore + 1} />
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {/* 底部導航欄 */}
                      <BottomNavbar />