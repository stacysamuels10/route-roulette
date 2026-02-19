import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RouteCard from "./RouteCard";
import ChallengeCard from "./ChallengeCard";

// ── Constants ──────────────────────────────────────────
const ITEM_H = 72;
const REEL_LEN = 32;
const WIN_IDX = REEL_LEN - 5; // lands on index 27
const VIEWPORT_ITEMS = 3;
const VIEWPORT_H = VIEWPORT_ITEMS * ITEM_H;

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

function playTick(ctx, pitch = 800) {
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = pitch;
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.03);
  } catch {
    /* audio not supported */
  }
}

function playLockIn(ctx) {
  if (!ctx) return;
  try {
    [1000, 1320].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.07;
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      osc.start(t);
      osc.stop(t + 0.15);
    });
  } catch {
    /* audio not supported */
  }
}

// ── Easing ─────────────────────────────────────────────
// Cubic ease-out: fast start, gradual deceleration
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

// ── Filters ────────────────────────────────────────────
const FILTERS = [
  { value: "all", label: "All", emoji: "🎯" },
  { value: "road", label: "Road", emoji: "🛣️" },
  { value: "gravel", label: "Gravel", emoji: "🪨" },
];

// ════════════════════════════════════════════════════════
// Spinner Component
// ════════════════════════════════════════════════════════
export default function Spinner({ routes, challenges }) {
  const [phase, setPhase] = useState("idle"); // idle | spinning | locked | result
  const [filter, setFilter] = useState("all");
  const [result, setResult] = useState(null); // { route, challenge }
  const [reel, setReel] = useState([]);
  const [accepted, setAccepted] = useState(false);

  const reelRef = useRef(null);
  const audioRef = useRef(null);
  const lastIdxRef = useRef(-1);
  const rafRef = useRef(null);

  const filtered = useMemo(() => {
    if (filter === "all") return routes;
    return routes.filter((r) => r.type === filter);
  }, [routes, filter]);

  const roadCount = routes.filter((r) => r.type === "road").length;
  const gravelCount = routes.filter((r) => r.type === "gravel").length;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ── Spin handler ─────────────────────────────────────
  const handleSpin = useCallback(() => {
    if (filtered.length === 0) return;

    // Pick winners
    const route = filtered[Math.floor(Math.random() * filtered.length)];
    const challenge = challenges[Math.floor(Math.random() * challenges.length)];
    setResult({ route, challenge });
    setAccepted(false);

    // Build reel array with winner at WIN_IDX
    const items = Array.from({ length: REEL_LEN }, (_, i) => {
      if (i === WIN_IDX) return route;
      return filtered[Math.floor(Math.random() * filtered.length)];
    });
    setReel(items);
    setPhase("spinning");
    lastIdxRef.current = -1;

    // Init audio (must be on user gesture)
    const ctx = getCtx(audioRef);

    // Start reel animation after render
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const target = (WIN_IDX - 1) * ITEM_H;
        const startTime = performance.now();
        const duration = 3500;

        const tick = (now) => {
          const elapsed = now - startTime;
          const t = Math.min(elapsed / duration, 1);
          const value = easeOut(t) * target;

          if (reelRef.current) {
            reelRef.current.style.transform = `translateY(${-value}px)`;
          }

          // Tick sound on each new item
          const idx = Math.floor(value / ITEM_H);
          if (idx !== lastIdxRef.current) {
            lastIdxRef.current = idx;
            playTick(ctx, 600 + t * 500);
          }

          if (t < 1) {
            rafRef.current = requestAnimationFrame(tick);
          } else {
            // Bounce animation
            doBounce(target, ctx);
          }
        };

        rafRef.current = requestAnimationFrame(tick);
      });
    });
  }, [filtered, challenges]);

  // ── Bounce & lock-in ─────────────────────────────────
  const doBounce = (target, ctx) => {
    const start = performance.now();
    const dur = 350;
    const amp = 14;

    const step = (now) => {
      const bt = Math.min((now - start) / dur, 1);
      // Damped oscillation: overshoot, undershoot, settle
      const decay = 1 - bt;
      const wave = Math.sin(bt * Math.PI * 2.5) * decay * amp;

      if (reelRef.current) {
        reelRef.current.style.transform = `translateY(${-(target + wave)}px)`;
      }

      if (bt < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        if (reelRef.current) {
          reelRef.current.style.transform = `translateY(${-target}px)`;
        }
        playLockIn(ctx);
        setPhase("locked");
        setTimeout(() => setPhase("result"), 600);
      }
    };

    rafRef.current = requestAnimationFrame(step);
  };

  // ── Reset ────────────────────────────────────────────
  const handleSpinAgain = () => {
    setPhase("idle");
    setResult(null);
  };

  // ── Render ───────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Filter chips */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <motion.button
              key={f.value}
              whileTap={{ scale: 0.93 }}
              onClick={() => phase === "idle" && setFilter(f.value)}
              disabled={phase !== "idle"}
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all duration-200 ${
                filter === f.value
                  ? "bg-accent-500 text-white shadow-lg shadow-accent-500/25"
                  : "bg-white/[0.04] text-zinc-500 hover:bg-white/[0.08] hover:text-zinc-300"
              } ${phase !== "idle" ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {f.emoji} {f.label}
            </motion.button>
          ))}
        </div>
        <span className="text-[10px] text-zinc-600 font-medium tabular-nums">
          {filtered.length} routes
        </span>
      </div>

      <AnimatePresence mode="wait">
        {/* ─── IDLE ───────────────────────────────── */}
        {phase === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            {/* Location strip */}
            <div className="w-full glass overflow-hidden mb-6">
              <div className="h-24 bg-gradient-to-br from-brand-800 to-brand-900 relative">
                <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2260%22%20height%3D%2260%22%3E%3Cpath%20d%3D%22M0%2030h60M30%200v60%22%20stroke%3D%22%23ffffff%22%20stroke-width%3D%220.3%22%20fill%3D%22none%22%2F%3E%3C%2Fsvg%3E')]" />
                <div className="absolute top-3 right-3 glass text-[10px] text-zinc-300 px-2.5 py-1 rounded-lg font-medium">
                  Mostly Cloudy, 68°F
                </div>
                <div className="absolute bottom-3 left-4">
                  <p className="text-[10px] font-semibold text-accent-400 tracking-wider uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />
                    Current Location
                  </p>
                  <p className="text-white font-bold text-lg mt-0.5">
                    Nashville, TN
                  </p>
                </div>
              </div>
            </div>

            {/* Big spin button */}
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.93 }}
              onClick={handleSpin}
              disabled={filtered.length === 0}
              className="relative w-56 h-56 rounded-full bg-gradient-accent-h shadow-2xl shadow-accent-500/30 flex flex-col items-center justify-center gap-2 animate-pulse-glow disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="text-4xl">🎲</span>
              <span className="text-xl font-black tracking-wider italic text-white uppercase leading-tight text-center">
                Spin the
                <br />
                Wheel
              </span>
              <div className="w-10 h-0.5 bg-white/30 rounded-full mt-1" />

              {/* Pulsing ring */}
              <div
                className="absolute inset-[-4px] rounded-full border-2 border-accent-500/20 animate-ping"
                style={{ animationDuration: "3s" }}
              />
              <div className="absolute inset-[-8px] rounded-full border border-accent-500/10 animate-ping" style={{ animationDuration: "4s", animationDelay: "0.5s" }} />
            </motion.button>

            {/* Stats bar */}
            <div className="flex items-center gap-4 mt-8 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5 font-medium">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
                  />
                </svg>
                {routes.length} Total
              </span>
              <span className="text-zinc-700">|</span>
              <span>{roadCount} Road</span>
              <span className="text-zinc-700">|</span>
              <span>{gravelCount} Gravel</span>
            </div>

            {filtered.length === 0 && (
              <p className="mt-4 text-xs text-red-400">
                No routes match this filter.
              </p>
            )}
          </motion.div>
        )}

        {/* ─── SPINNING / LOCKED ──────────────────── */}
        {(phase === "spinning" || phase === "locked") && (
          <motion.div
            key="spinning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center pt-6 pb-4"
          >
            {/* Reel viewport */}
            <div
              className="relative w-full overflow-hidden rounded-2xl border border-white/[0.06] bg-brand-950/50"
              style={{ height: VIEWPORT_H }}
            >
              {/* Fade overlays */}
              <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-brand-950 to-transparent z-10 pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-brand-950 to-transparent z-10 pointer-events-none" />

              {/* Center selection indicators */}
              <div
                className="absolute left-0 right-0 z-10 pointer-events-none"
                style={{ top: ITEM_H }}
              >
                <div className="h-px bg-accent-500/50 shadow-sm shadow-accent-500/30" />
              </div>
              <div
                className="absolute left-0 right-0 z-10 pointer-events-none"
                style={{ top: ITEM_H * 2 }}
              >
                <div className="h-px bg-accent-500/50 shadow-sm shadow-accent-500/30" />
              </div>

              {/* Left accent bar on selected row */}
              <div
                className="absolute left-0 w-1 bg-accent-500 z-10 rounded-r-full"
                style={{ top: ITEM_H, height: ITEM_H }}
              />

              {/* Reel strip */}
              <div ref={reelRef} className="will-change-transform">
                {reel.map((route, i) => {
                  const isWinner = i === WIN_IDX;
                  return (
                    <div
                      key={`${route.id}-${i}`}
                      className={`flex items-center gap-3 px-4 border-b border-white/[0.03] transition-colors ${
                        isWinner && phase === "locked"
                          ? "bg-accent-500/10"
                          : ""
                      }`}
                      style={{ height: ITEM_H }}
                    >
                      <span className="text-lg shrink-0">
                        {route.type === "road" ? "🛣️" : "🪨"}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">
                          {route.name}
                        </p>
                        <p className="text-[11px] text-zinc-500">
                          {route.distance}mi &middot;{" "}
                          {route.elevation.toLocaleString()}ft &middot;{" "}
                          {route.difficulty}
                        </p>
                      </div>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0 ${
                          route.type === "road"
                            ? "bg-accent-500/15 text-accent-400"
                            : "bg-stone-500/15 text-stone-400"
                        }`}
                      >
                        {route.type}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Status */}
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="mt-6 flex items-center gap-2 text-sm text-zinc-400 font-medium tracking-wider"
            >
              {phase === "locked" ? (
                <motion.span
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="text-accent-400 font-bold"
                >
                  🎯 Locked in!
                </motion.span>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182"
                    />
                  </svg>
                  Spinning...
                </>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* ─── RESULT ─────────────────────────────── */}
        {phase === "result" && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-5 pb-6"
          >
            {/* Result header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center pt-2"
            >
              <p className="text-xs font-bold text-accent-400 tracking-[0.2em] uppercase">
                Result
              </p>
              <h2 className="text-2xl font-extrabold mt-1">
                The results are in!
              </h2>
            </motion.div>

            {/* Route card */}
            <RouteCard route={result.route} />

            {/* Challenge card */}
            <ChallengeCard
              challenge={result.challenge}
              accepted={accepted}
              onAccept={() => setAccepted((a) => !a)}
            />

            {/* Spin again */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSpinAgain}
              className="w-full py-3.5 glass rounded-xl text-sm font-bold text-zinc-300 flex items-center justify-center gap-2 hover:bg-white/[0.07] transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182"
                />
              </svg>
              Spin Again
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
