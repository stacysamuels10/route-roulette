import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "./Confetti";

export default function Header({ jokes = [] }) {
  const [jokeIndex, setJokeIndex] = useState(0);
  const [jokeExpanded, setJokeExpanded] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);

  // Rotate jokes every 8 seconds
  useEffect(() => {
    if (jokes.length === 0) return;
    const interval = setInterval(() => {
      setJokeIndex((prev) => (prev + 1) % jokes.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [jokes.length]);

  // Fade confetti after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <header className="relative">
      {/* Brief confetti on first load */}
      {showConfetti && <Confetti particleCount={25} fadeAfter={3000} />}

      {/* Birthday banner */}
      <div className="bg-gradient-to-r from-accent-700/30 via-accent-500/20 to-accent-700/30 border-b border-accent-500/10">
        <div className="max-w-lg mx-auto px-4 py-2.5 text-center">
          <p className="text-xs sm:text-sm text-accent-300/90 font-medium tracking-wide">
            <span className="mr-1.5">🎂</span>
            Happy Birthday Jason! Spin the wheel. Ride the route. Embrace the
            chaos.
          </p>
        </div>
      </div>

      {/* App header bar */}
      <div className="max-w-lg mx-auto px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Bike icon in orange rounded square */}
            <div className="w-10 h-10 bg-accent-500 rounded-xl flex items-center justify-center shadow-lg shadow-accent-500/20">
              <svg
                className="w-5 h-5 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M5 18a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Zm0-2a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm14 2a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Zm0-2a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM12.598 5h2.152a1 1 0 0 1 .928.629l2.25 5.625a1 1 0 0 1-.928 1.371h-.04l-3.037-.07L12 14.5l-2-2.5-3.5-1L8 8.5h3l1.598-3.5Z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight leading-none">
                ROUTE ROULETTE
              </h1>
              <p className="text-xs text-zinc-500 mt-0.5">
                Welcome back, Jason
              </p>
            </div>
          </div>

          {/* Bell icon */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 glass rounded-xl flex items-center justify-center"
          >
            <svg
              className="w-5 h-5 text-accent-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
              />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Joke ticker — click to expand/collapse */}
      {jokes.length > 0 && (
        <div className="max-w-lg mx-auto px-4 pb-4">
          <motion.button
            onClick={() => setJokeExpanded((e) => !e)}
            className="w-full text-left glass rounded-xl px-4 py-2.5 overflow-hidden cursor-pointer active:scale-[0.99] transition-transform"
          >
            <div className="flex items-start gap-2 min-h-[20px]">
              <span className="text-accent-400 text-sm font-bold shrink-0 mt-0.5">
                &#10077;&#10077;
              </span>
              <AnimatePresence mode="wait">
                <motion.p
                  key={jokeIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={`text-xs sm:text-sm text-zinc-400 italic flex-1 ${
                    jokeExpanded ? "" : "line-clamp-1"
                  }`}
                >
                  {jokes[jokeIndex]}
                </motion.p>
              </AnimatePresence>
              <span className="text-accent-400 text-sm font-bold shrink-0 mt-0.5">
                &#10078;&#10078;
              </span>
            </div>
          </motion.button>
        </div>
      )}
    </header>
  );
}
