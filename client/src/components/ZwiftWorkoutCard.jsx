import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const INTENSITY_STYLES = {
  moderate: { color: "text-sky-400", bg: "bg-sky-500/15", icon: "⚡" },
  hard: { color: "text-amber-400", bg: "bg-amber-500/15", icon: "⚡⚡" },
  brutal: { color: "text-red-400", bg: "bg-red-500/15", icon: "⚡⚡⚡" },
};

const STEP_COLORS = [
  "bg-sky-500",
  "bg-red-500",
  "bg-emerald-500",
  "bg-purple-500",
  "bg-amber-500",
  "bg-pink-500",
  "bg-cyan-500",
  "bg-orange-500",
  "bg-lime-500",
  "bg-violet-500",
  "bg-rose-500",
  "bg-teal-500",
];

export default function ZwiftWorkoutCard({ workout, expanded: controlledExpanded, onToggle, featured = false }) {
  const [internalExpanded, setInternalExpanded] = useState(false);

  // Support both controlled and uncontrolled expansion
  const expanded = onToggle ? controlledExpanded : internalExpanded;
  const toggleExpand = onToggle || (() => setInternalExpanded((e) => !e));

  const intensity = INTENSITY_STYLES[workout.intensity] || INTENSITY_STYLES.moderate;

  return (
    <motion.div
      layout
      initial={featured ? { opacity: 0, y: 20, scale: 0.97 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={featured
        ? { type: "spring", stiffness: 200, damping: 22 }
        : { duration: 0.3 }
      }
      className={`overflow-hidden rounded-2xl transition-colors duration-300 ${
        featured
          ? "bg-white/[0.06] border border-purple-500/20 shadow-lg shadow-purple-500/10"
          : "bg-white/[0.04] border border-white/[0.06] hover:border-white/[0.1]"
      }`}
    >
      {/* Header — always visible */}
      <button
        onClick={toggleExpand}
        className="w-full text-left p-4 flex items-center gap-3"
      >
        {/* Emoji avatar */}
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg ${
            workout.type === "serious"
              ? "bg-purple-500/20"
              : "bg-pink-500/20"
          }`}
        >
          {workout.emoji}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className={`font-bold truncate ${featured ? "text-base" : "text-sm"}`}>
              {workout.name}
            </h3>
            <span
              className={`shrink-0 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                workout.type === "serious"
                  ? "bg-purple-500/20 text-purple-400"
                  : "bg-pink-500/20 text-pink-400"
              }`}
            >
              {workout.type}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-zinc-500">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              {workout.duration}
            </span>
            <span className={`flex items-center gap-1 ${intensity.color}`}>
              {intensity.icon}{" "}
              <span className="capitalize">{workout.intensity}</span>
            </span>
          </div>
        </div>

        {/* Expand chevron */}
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <svg
            className="w-4 h-4 text-zinc-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </motion.div>
      </button>

      {/* Expandable content */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4">
              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

              {/* Description */}
              <p className="text-sm text-zinc-400 leading-relaxed">
                {workout.description}
              </p>

              {/* Workout steps */}
              <div>
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.15em] mb-3">
                  Workout Steps
                </h4>
                <div className="space-y-2">
                  {workout.instructions.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.25 }}
                      className="flex items-start gap-3"
                    >
                      {/* Step number */}
                      <div className="w-6 h-6 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold text-zinc-400">
                          {i + 1}
                        </span>
                      </div>

                      {/* Step text + color bar */}
                      <div className="flex-1 min-w-0 flex items-center gap-3">
                        <p className="text-xs text-zinc-300 leading-relaxed flex-1">
                          {step}
                        </p>
                        <div
                          className={`w-12 h-1.5 rounded-full shrink-0 ${
                            STEP_COLORS[i % STEP_COLORS.length]
                          }`}
                          style={{ opacity: 0.6 }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Tip */}
              {workout.tip && (
                <div className="flex gap-2 p-3 rounded-xl bg-purple-500/[0.06] border border-purple-500/10">
                  <span className="text-sm shrink-0">💡</span>
                  <p className="text-xs text-purple-300/80 italic leading-relaxed">
                    {workout.tip}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
