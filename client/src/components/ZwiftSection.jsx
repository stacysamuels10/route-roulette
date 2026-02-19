import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ZwiftWorkoutCard from "./ZwiftWorkoutCard";

// ── Audio ──────────────────────────────────────────────
function getCtx(ref) {
  if (!ref.current) {
    try {
      ref.current = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return ref.current;
}

function playShuffle(ctx) {
  if (!ctx) return;
  try {
    // Quick ascending arpeggio — card shuffle feel
    [440, 554, 659, 880].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "triangle";
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.06;
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
      osc.start(t);
      osc.stop(t + 0.1);
    });
  } catch {
    /* no audio */
  }
}

function playReveal(ctx) {
  if (!ctx) return;
  try {
    // Bright two-tone reveal
    [660, 880].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.1;
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      osc.start(t);
      osc.stop(t + 0.2);
    });
  } catch {
    /* no audio */
  }
}

// ── Filters ────────────────────────────────────────────
const FILTERS = [
  { value: "all", label: "All" },
  { value: "serious", label: "🏋️ Serious" },
  { value: "goofy", label: "🤡 Goofy" },
];

// ── Shuffle animation card previews ───────────────────
const SHUFFLE_FRAMES = 8;
const SHUFFLE_INTERVAL = 150; // ms per frame
const SETTLE_DELAY = 300; // pause before reveal

// ════════════════════════════════════════════════════════
// ZwiftSection Component
// ════════════════════════════════════════════════════════
export default function ZwiftSection({ workouts }) {
  const [filter, setFilter] = useState("all");
  const [phase, setPhase] = useState("idle"); // idle | shuffling | result
  const [result, setResult] = useState(null);
  const [shufflePreview, setShufflePreview] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const audioRef = useRef(null);
  const timeoutsRef = useRef([]);

  const filtered = useMemo(() => {
    if (filter === "all") return workouts;
    return workouts.filter((w) => w.type === filter);
  }, [workouts, filter]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => timeoutsRef.current.forEach(clearTimeout);
  }, []);

  // ── Spin handler ─────────────────────────────────────
  const handleSpin = useCallback(() => {
    if (filtered.length === 0) return;

    const winner = filtered[Math.floor(Math.random() * filtered.length)];
    setResult(winner);
    setPhase("shuffling");
    setExpandedId(null);

    const ctx = getCtx(audioRef);
    playShuffle(ctx);

    // Clear old timeouts
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    // Rapid-fire shuffle through random workouts
    for (let i = 0; i < SHUFFLE_FRAMES; i++) {
      const tid = setTimeout(() => {
        const preview = filtered[Math.floor(Math.random() * filtered.length)];
        setShufflePreview(preview);

        // Play a quiet tick on later frames (tension builds)
        if (ctx && i > SHUFFLE_FRAMES / 2) {
          try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = "sine";
            osc.frequency.value = 500 + i * 60;
            gain.gain.setValueAtTime(0.04, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(
              0.001,
              ctx.currentTime + 0.03
            );
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.03);
          } catch {
            /* */
          }
        }
      }, i * SHUFFLE_INTERVAL);
      timeoutsRef.current.push(tid);
    }

    // Settle on winner
    const revealTid = setTimeout(() => {
      setShufflePreview(winner);
      playReveal(ctx);

      const finalTid = setTimeout(() => {
        setPhase("result");
        setExpandedId(winner.id);
      }, SETTLE_DELAY);
      timeoutsRef.current.push(finalTid);
    }, SHUFFLE_FRAMES * SHUFFLE_INTERVAL);
    timeoutsRef.current.push(revealTid);
  }, [filtered]);

  const handleSpinAgain = () => {
    setPhase("idle");
    setResult(null);
    setShufflePreview(null);
    setExpandedId(null);
  };

  // ── Render ───────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="text-center">
        <p className="text-[10px] font-bold text-purple-400 tracking-[0.2em] uppercase">
          Happy Birthday Jason! 🎉
        </p>
      </div>

      {/* Spin button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={phase === "result" ? handleSpinAgain : handleSpin}
        disabled={phase === "shuffling"}
        className="w-full py-4 rounded-2xl text-white font-bold text-lg tracking-wider uppercase shadow-xl transition-all duration-300 bg-gradient-to-r from-purple-600 to-purple-400 shadow-purple-500/25 hover:shadow-purple-500/40 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {phase === "result" ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
            </svg>
            Spin Again
          </span>
        ) : (
          "Spin a Workout 🎲"
        )}
      </motion.button>

      {/* Filter chips */}
      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <motion.button
            key={f.value}
            whileTap={{ scale: 0.93 }}
            onClick={() => {
              if (phase !== "shuffling") {
                setFilter(f.value);
                if (phase === "result") handleSpinAgain();
              }
            }}
            disabled={phase === "shuffling"}
            className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all duration-200 ${
              filter === f.value
                ? "bg-purple-500 text-white shadow-lg shadow-purple-500/25"
                : "bg-white/[0.04] text-zinc-500 hover:bg-white/[0.08] hover:text-zinc-300"
            } ${phase === "shuffling" ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {f.label}
          </motion.button>
        ))}
        <span className="ml-auto text-[10px] text-zinc-600 font-medium self-center tabular-nums">
          {filtered.length} workouts
        </span>
      </div>

      {/* ─── Shuffle preview card ──────────────────── */}
      <AnimatePresence mode="wait">
        {phase === "shuffling" && shufflePreview && (
          <motion.div
            key={shufflePreview.id + "-shuffle"}
            initial={{ opacity: 0, rotateX: -30, y: -10 }}
            animate={{ opacity: 1, rotateX: 0, y: 0 }}
            exit={{ opacity: 0, rotateX: 30, y: 10 }}
            transition={{ duration: 0.1 }}
            className="perspective-500"
          >
            <div className="bg-white/[0.06] border border-purple-500/20 rounded-2xl p-5 text-center shadow-lg shadow-purple-500/10">
              <motion.span
                key={shufflePreview.emoji}
                initial={{ scale: 0.5, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                className="text-5xl block mb-3"
              >
                {shufflePreview.emoji}
              </motion.span>
              <h3 className="text-lg font-bold">{shufflePreview.name}</h3>
              <p className="text-xs text-zinc-500 mt-1">
                {shufflePreview.duration} &middot; {shufflePreview.intensity}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Result ────────────────────────────────── */}
      <AnimatePresence>
        {phase === "result" && result && (
          <motion.div
            key="zwift-result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Result header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <p className="text-xs font-bold text-purple-400 tracking-[0.2em] uppercase">
                Your Workout
              </p>
              <h2 className="text-xl font-extrabold mt-1">
                Get on the trainer! 🚴‍♂️
              </h2>
            </motion.div>

            {/* Featured workout card */}
            <ZwiftWorkoutCard
              workout={result}
              featured
              expanded={expandedId === result.id}
              onToggle={() =>
                setExpandedId((id) => (id === result.id ? null : result.id))
              }
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── All workouts grid ─────────────────────── */}
      {phase !== "shuffling" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: phase === "result" ? 0.3 : 0 }}
        >
          {/* Section header */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-zinc-400">
              {phase === "result" ? "Other Workouts" : "All Workouts"}
            </h3>
            <span className="text-[10px] text-zinc-600">
              {filtered.length} total
            </span>
          </div>

          {/* Workout list */}
          <div className="space-y-2.5">
            {filtered
              .filter((w) => !(phase === "result" && result && w.id === result.id))
              .map((workout, i) => (
                <motion.div
                  key={workout.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.25 }}
                >
                  <ZwiftWorkoutCard
                    workout={workout}
                    expanded={expandedId === workout.id}
                    onToggle={() =>
                      setExpandedId((id) =>
                        id === workout.id ? null : workout.id
                      )
                    }
                  />
                </motion.div>
              ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
