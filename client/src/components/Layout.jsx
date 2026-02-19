import { motion, AnimatePresence } from "framer-motion";
import Header from "./Header";

const TABS = [
  {
    id: "outdoor",
    label: "Outdoor",
    emoji: "🛣️",
    icon: (active) => (
      <svg
        className="w-5 h-5"
        fill={active ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        strokeWidth={active ? 0 : 1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d={
            active
              ? "M5 18a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Zm0-2a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm14 2a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Zm0-2a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM12.6 5h2.15a1 1 0 0 1 .93.63l2.25 5.62a1 1 0 0 1-.93 1.37h-.04l-3.04-.07L12 14.5l-2-2.5-3.5-1L8 8.5h3l1.6-3.5Z"
              : "M5 18a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Zm14 0a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7ZM12 14.5l2.923-1.955L17.25 6H14l-2 3H8L6.5 11l3.5 1 2 2.5Z"
          }
        />
      </svg>
    ),
  },
  {
    id: "zwift",
    label: "Zwift",
    emoji: "🏠",
    icon: (active) => (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
        />
        {active && (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 9.5l2.5 2L13 8.5l3 3"
            strokeWidth={2}
          />
        )}
      </svg>
    ),
  },
  {
    id: "routes",
    label: "All Routes",
    emoji: "📊",
    icon: (active) => (
      <svg
        className="w-5 h-5"
        fill={active ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z"
        />
      </svg>
    ),
  },
];

const TAB_VARIANTS = {
  enter: (direction) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction < 0 ? 80 : -80,
    opacity: 0,
  }),
};

export default function Layout({
  activeTab,
  onTabChange,
  jokes,
  children,
  tabContents,
}) {
  // Track swipe direction for animations
  const direction = activeTab;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grain min-h-screen flex flex-col"
      >
        {/* Ambient glow */}
        <div className="ambient-glow" />

        {/* Header */}
        <Header jokes={jokes} />

        {/* Tab content area */}
        <main className="flex-1 max-w-lg mx-auto w-full px-4 pb-24 relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeTab}
              custom={direction}
              variants={TAB_VARIANTS}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {tabContents?.[activeTab] || children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <div className="max-w-lg mx-auto w-full px-4 pb-20 text-center">
          <p className="text-[10px] text-zinc-700">
            Made with ❤️ and too many miles
          </p>
        </div>
      </motion.div>

      {/* Bottom tab navigation — outside motion.div so fixed positioning works */}
      <nav className="fixed bottom-0 left-0 right-0 z-40">
        <div className="max-w-lg mx-auto">
          <div className="mx-2 mb-2 liquid-glass rounded-2xl px-2 py-1 shadow-2xl shadow-black/50">
            <div className="flex items-center justify-around">
              {TABS.map((tab, index) => {
                const isActive = activeTab === index;
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => onTabChange(index)}
                    whileTap={{ scale: 0.92 }}
                    className={`relative flex flex-col items-center gap-0.5 py-2 px-4 rounded-xl transition-colors duration-200 ${
                      isActive ? "text-accent-400" : "text-zinc-500"
                    }`}
                  >
                    {/* Active indicator dot */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute -top-0.5 w-5 h-0.5 bg-accent-500 rounded-full"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}

                    <span
                      className={`transition-transform duration-200 ${
                        isActive ? "scale-110" : ""
                      }`}
                    >
                      {tab.icon(isActive)}
                    </span>
                    <span
                      className={`text-[10px] font-semibold tracking-wide ${
                        isActive ? "text-accent-400" : "text-zinc-600"
                      }`}
                    >
                      {tab.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
