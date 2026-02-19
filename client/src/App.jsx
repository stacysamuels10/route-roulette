import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "./components/Layout";
import Confetti from "./components/Confetti";
import Spinner from "./components/Spinner";
import ZwiftSection from "./components/ZwiftSection";
import AllRoutes from "./components/AllRoutes";
import routes from "./data/routes";
import challenges from "./data/challenges";
import zwiftWorkouts from "./data/zwiftWorkouts";
import jokes from "./data/jokes";

// ── Splash Screen ──────────────────────────────────────
function SplashScreen({ onDismiss }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
      className="fixed inset-0 bg-brand-950 flex flex-col items-center justify-center z-50"
    >
      {/* Grain */}
      <div className="grain fixed inset-0 pointer-events-none" />

      {/* Ambient glow */}
      <div className="ambient-glow" />

      {/* Explosion confetti — big burst for 3s */}
      <Confetti particleCount={120} explosion fadeAfter={3000} />

      {/* Floating confetti — gentle background */}
      <Confetti particleCount={45} />

      {/* Top bar */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-2 text-zinc-500">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 18a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Zm0-2a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm14 2a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Zm0-2a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM12.6 5h2.15a1 1 0 0 1 .93.63l2.25 5.62a1 1 0 0 1-.93 1.37h-.04l-3.04-.07L12 14.5l-2-2.5-3.5-1L8 8.5h3l1.6-3.5Z" />
          </svg>
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase">
            Route Roulette
          </span>
        </div>
        <span className="text-[10px] text-zinc-700 tracking-widest">
          VER 1.0
        </span>
      </div>

      {/* Center content */}
      <div className="flex flex-col items-center z-10 px-6">
        {/* Orange line + cake */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
          className="flex flex-col items-center mb-10"
        >
          <div className="w-14 h-1 bg-accent-500 rounded-full mb-5" />
          <span className="text-8xl drop-shadow-2xl">🎂</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-4xl sm:text-5xl font-extrabold text-center leading-tight"
        >
          Happy Birthday
          <br />
          <span className="bg-gradient-to-r from-accent-400 to-accent-500 bg-clip-text text-transparent italic">
            Jason!
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-6 text-zinc-500 text-center leading-relaxed text-sm sm:text-base"
        >
          Your sister built this for you.
          <br />
          Now stop reading and go ride.
        </motion.p>
      </div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.5 }}
        className="absolute bottom-10 left-6 right-6 max-w-lg mx-auto z-10"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onDismiss}
          className="w-full py-4 bg-gradient-accent-h rounded-2xl text-white font-bold text-lg tracking-widest uppercase shadow-xl shadow-accent-500/25 transition-shadow hover:shadow-accent-500/40"
        >
          ENTER ROUTE ROULETTE →
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// ── Main App ───────────────────────────────────────────
export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  const tabContents = [
    <Spinner key="outdoor" routes={routes} challenges={challenges} />,
    <ZwiftSection key="zwift" workouts={zwiftWorkouts} />,
    <AllRoutes key="routes" routes={routes} />,
  ];

  return (
    <div className="min-h-screen bg-brand-950 text-white">
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen key="splash" onDismiss={() => setShowSplash(false)} />
        ) : (
          <Layout
            key="main"
            activeTab={activeTab}
            onTabChange={setActiveTab}
            jokes={jokes}
            tabContents={tabContents}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
