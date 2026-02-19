import { motion } from "framer-motion";

const CATEGORY_STYLES = {
  physical: {
    bg: "bg-blue-500/15",
    text: "text-blue-400",
    border: "from-blue-500/30 to-blue-500/5",
  },
  goofy: {
    bg: "bg-pink-500/15",
    text: "text-pink-400",
    border: "from-pink-500/30 to-pink-500/5",
  },
  food: {
    bg: "bg-emerald-500/15",
    text: "text-emerald-400",
    border: "from-emerald-500/30 to-emerald-500/5",
  },
};

export default function ChallengeCard({ challenge, accepted, onAccept }) {
  const style = CATEGORY_STYLES[challenge.category] || CATEGORY_STYLES.physical;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 150, damping: 20, delay: 0.15 }}
      className="relative rounded-2xl overflow-hidden"
    >
      {/* Gradient border */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${style.border} p-px`}
      >
        <div className="w-full h-full rounded-2xl bg-brand-900" />
      </div>

      {/* Content */}
      <div className="relative p-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <motion.span
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 15,
                delay: 0.25,
              }}
              className="text-2xl"
            >
              {challenge.emoji}
            </motion.span>
            <h4 className="text-base font-bold">{challenge.name}</h4>
          </div>
          <span
            className={`text-[9px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider ${style.bg} ${style.text}`}
          >
            {challenge.category}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-zinc-400 leading-relaxed mb-4">
          {challenge.description}
        </p>

        {/* Accept toggle */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onAccept}
          className={`w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
            accepted
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-white/[0.04] text-zinc-400 border border-white/[0.08] hover:bg-white/[0.07] hover:text-zinc-300"
          }`}
        >
          {accepted ? (
            <>
              <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 12 }}
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </motion.svg>
              Challenge Accepted!
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              Accept Challenge
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
