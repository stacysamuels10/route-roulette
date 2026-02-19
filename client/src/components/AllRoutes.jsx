import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

// ── Constants ──────────────────────────────────────────
const DIFFICULTY_ORDER = { easy: 0, intermediate: 1, advanced: 2, epic: 3 };

const DIFFICULTY_STYLES = {
  easy: "bg-emerald-500/20 text-emerald-400 border-emerald-500/25",
  intermediate: "bg-amber-500/20 text-amber-400 border-amber-500/25",
  advanced: "bg-orange-500/20 text-orange-400 border-orange-500/25",
  epic: "bg-red-500/20 text-red-400 border-red-500/25",
};

const TYPE_STYLES = {
  road: "bg-accent-500/20 text-accent-400",
  gravel: "bg-stone-500/20 text-stone-300",
};

const TYPE_FILTERS = [
  { value: "all", label: "All" },
  { value: "road", label: "Road" },
  { value: "gravel", label: "Gravel" },
];

const DIFF_FILTERS = [
  { value: "all", label: "Any Level" },
  { value: "easy", label: "Easy" },
  { value: "intermediate", label: "Mid" },
  { value: "advanced", label: "Advanced" },
  { value: "epic", label: "Epic" },
];

const SORT_OPTIONS = [
  { value: "name", label: "Name" },
  { value: "distance", label: "Distance" },
  { value: "elevation", label: "Elevation" },
  { value: "difficulty", label: "Difficulty" },
];

const DIST_MIN = 0;
const DIST_MAX = 85;

// ════════════════════════════════════════════════════════
// AllRoutes Component
// ════════════════════════════════════════════════════════
export default function AllRoutes({ routes }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [diffFilter, setDiffFilter] = useState("all");
  const [distRange, setDistRange] = useState([DIST_MIN, DIST_MAX]);
  const [sortBy, setSortBy] = useState("name");
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // ── Filtered + sorted routes ─────────────────────────
  const filtered = useMemo(() => {
    let result = routes;

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.startLocation.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Type
    if (typeFilter !== "all") {
      result = result.filter((r) => r.type === typeFilter);
    }

    // Difficulty
    if (diffFilter !== "all") {
      result = result.filter((r) => r.difficulty === diffFilter);
    }

    // Distance range
    result = result.filter(
      (r) => r.distance >= distRange[0] && r.distance <= distRange[1]
    );

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "distance":
          return a.distance - b.distance;
        case "elevation":
          return b.elevation - a.elevation;
        case "difficulty":
          return (
            (DIFFICULTY_ORDER[a.difficulty] || 0) -
            (DIFFICULTY_ORDER[b.difficulty] || 0)
          );
        default:
          return 0;
      }
    });

    return result;
  }, [routes, search, typeFilter, diffFilter, distRange, sortBy]);

  const handleClearAll = useCallback(() => {
    setSearch("");
    setTypeFilter("all");
    setDiffFilter("all");
    setDistRange([DIST_MIN, DIST_MAX]);
    setSortBy("name");
    setExpandedId(null);
  }, []);

  const hasActiveFilters =
    search.trim() ||
    typeFilter !== "all" ||
    diffFilter !== "all" ||
    distRange[0] !== DIST_MIN ||
    distRange[1] !== DIST_MAX;

  // ── Render ───────────────────────────────────────────
  return (
    <div className="space-y-4 pt-1">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold">Find a Route</h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilters((s) => !s)}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
            showFilters
              ? "bg-accent-500/20 border border-accent-500/30"
              : "glass"
          }`}
        >
          <svg
            className={`w-5 h-5 transition-colors ${showFilters ? "text-accent-400" : "text-zinc-500"}`}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
            />
          </svg>
        </motion.button>
      </div>

      {/* Search bar */}
      <div className="glass flex items-center gap-3 px-4 py-3">
        <svg
          className="w-4 h-4 text-zinc-500 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search routes, locations, tags..."
          className="bg-transparent text-sm text-white placeholder-zinc-600 outline-none flex-1 min-w-0"
        />
        {search && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSearch("")}
            className="text-zinc-500 hover:text-zinc-300"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </motion.button>
        )}
      </div>

      {/* Type filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-0.5 -mx-1 px-1 scrollbar-none">
        {TYPE_FILTERS.map((f) => (
          <motion.button
            key={f.value}
            whileTap={{ scale: 0.93 }}
            onClick={() => setTypeFilter(f.value)}
            className={`shrink-0 text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all duration-200 ${
              typeFilter === f.value
                ? "bg-accent-500 text-white shadow-lg shadow-accent-500/25"
                : "bg-white/[0.04] text-zinc-500 hover:bg-white/[0.08] hover:text-zinc-300"
            }`}
          >
            {f.label}
          </motion.button>
        ))}
        <div className="w-px bg-white/[0.06] shrink-0 my-0.5" />
        {DIFF_FILTERS.map((f) => (
          <motion.button
            key={f.value}
            whileTap={{ scale: 0.93 }}
            onClick={() => setDiffFilter(f.value)}
            className={`shrink-0 text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all duration-200 ${
              diffFilter === f.value
                ? "bg-white/10 text-white"
                : "bg-white/[0.04] text-zinc-500 hover:bg-white/[0.08] hover:text-zinc-300"
            }`}
          >
            {f.label}
          </motion.button>
        ))}
      </div>

      {/* Collapsible advanced filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="glass p-4 space-y-4">
              {/* Distance range slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.15em]">
                    Distance Range
                  </label>
                  <span className="text-xs text-zinc-400 tabular-nums font-medium">
                    {distRange[0]}–{distRange[1]} mi
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={DIST_MIN}
                    max={DIST_MAX}
                    value={distRange[0]}
                    onChange={(e) =>
                      setDistRange([
                        Math.min(+e.target.value, distRange[1] - 1),
                        distRange[1],
                      ])
                    }
                    className="flex-1 accent-accent-500 h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-accent-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-accent-500/30"
                  />
                  <input
                    type="range"
                    min={DIST_MIN}
                    max={DIST_MAX}
                    value={distRange[1]}
                    onChange={(e) =>
                      setDistRange([
                        distRange[0],
                        Math.max(+e.target.value, distRange[0] + 1),
                      ])
                    }
                    className="flex-1 accent-accent-500 h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-accent-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-accent-500/30"
                  />
                </div>
              </div>

              {/* Clear all */}
              {hasActiveFilters && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleClearAll}
                  className="text-xs text-accent-400 font-semibold flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                  Clear all filters
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Count + sort */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-zinc-500">
          Showing{" "}
          <span className="text-white font-bold">{filtered.length}</span> of{" "}
          {routes.length} routes
        </p>

        {/* Sort dropdown */}
        <div className="relative">
          <button
            onClick={() => setSortMenuOpen((o) => !o)}
            className="text-xs text-accent-400 font-semibold flex items-center gap-1"
          >
            Sort:{" "}
            {SORT_OPTIONS.find((o) => o.value === sortBy)?.label || "Name"}
            <svg
              className={`w-3 h-3 transition-transform ${sortMenuOpen ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          <AnimatePresence>
            {sortMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-7 z-30 glass-strong p-1.5 min-w-[120px] shadow-xl"
              >
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSortBy(opt.value);
                      setSortMenuOpen(false);
                    }}
                    className={`w-full text-left text-xs px-3 py-2 rounded-lg transition-colors ${
                      sortBy === opt.value
                        ? "bg-accent-500/15 text-accent-400 font-semibold"
                        : "text-zinc-400 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Route grid ──────────────────────────────── */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <span className="text-4xl block mb-3">🔍</span>
          <p className="text-sm text-zinc-500 font-medium">
            No routes match your filters.
          </p>
          <button
            onClick={handleClearAll}
            className="mt-3 text-xs text-accent-400 font-semibold"
          >
            Clear filters
          </button>
        </motion.div>
      ) : (
        <LayoutGroup>
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <AnimatePresence>
              {filtered.map((route) => (
                <RouteGridCard
                  key={route.id}
                  route={route}
                  expanded={expandedId === route.id}
                  onToggle={() =>
                    setExpandedId((id) => (id === route.id ? null : route.id))
                  }
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════
// RouteGridCard — compact card with expandable details
// ════════════════════════════════════════════════════════
function RouteGridCard({ route, expanded, onToggle }) {
  const startShort = route.startLocation.split(",")[0].trim();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25, layout: { type: "spring", stiffness: 300, damping: 30 } }}
      onClick={onToggle}
      className={`cursor-pointer overflow-hidden rounded-2xl transition-colors duration-200 ${
        expanded
          ? "bg-white/[0.06] border border-accent-500/20 col-span-1 sm:col-span-2 lg:col-span-3"
          : "bg-white/[0.04] border border-white/[0.06] hover:border-white/[0.12]"
      }`}
    >
      {/* ── Compact view (always shown) ─────────────── */}
      <motion.div layout="position" className="p-4">
        {/* Badges row */}
        <div className="flex items-center gap-1.5 mb-2">
          <span
            className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${TYPE_STYLES[route.type]}`}
          >
            {route.type}
          </span>
          <span
            className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border ${DIFFICULTY_STYLES[route.difficulty]}`}
          >
            {route.difficulty}
          </span>
        </div>

        {/* Name */}
        <h3
          className={`font-bold leading-tight mb-2 ${
            expanded ? "text-lg" : "text-sm"
          }`}
        >
          {route.name}
        </h3>

        {/* Stats row */}
        <div className="flex items-center gap-3 text-[11px] text-zinc-400">
          <span className="flex items-center gap-1 font-medium">
            <svg className="w-3 h-3 text-zinc-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
            </svg>
            {route.distance} mi
          </span>
          <span className="flex items-center gap-1 font-medium">
            <svg className="w-3 h-3 text-zinc-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
            </svg>
            {route.elevation.toLocaleString()} ft
          </span>
        </div>
      </motion.div>

      {/* ── Expanded details ────────────────────────── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

              {/* Full stats row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="glass-accent p-2.5 rounded-xl text-center">
                  <div className="flex justify-center mb-1">
                    <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
                    </svg>
                  </div>
                  <p className="text-base font-extrabold">{route.distance}</p>
                  <p className="text-[9px] text-zinc-500 uppercase tracking-wider font-semibold">
                    Miles
                  </p>
                </div>
                <div className="glass-accent p-2.5 rounded-xl text-center">
                  <div className="flex justify-center mb-1">
                    <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                    </svg>
                  </div>
                  <p className="text-base font-extrabold">
                    {route.elevation.toLocaleString()}
                  </p>
                  <p className="text-[9px] text-zinc-500 uppercase tracking-wider font-semibold">
                    Ft Elev
                  </p>
                </div>
                <div className="glass-accent p-2.5 rounded-xl text-center">
                  <div className="flex justify-center mb-1">
                    <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                  </div>
                  <p className="text-xs font-bold leading-tight">
                    {startShort}
                  </p>
                  <p className="text-[9px] text-zinc-500 uppercase tracking-wider font-semibold">
                    Start
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-zinc-400 leading-relaxed">
                {route.description}
              </p>

              {/* Highlights */}
              {route.highlights?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {route.highlights.map((h) => (
                    <span
                      key={h}
                      className="text-[10px] px-2.5 py-1 rounded-lg bg-white/[0.04] text-zinc-500 font-medium border border-white/[0.04]"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              )}

              {/* RWGPS Button */}
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={route.rwgpsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="block w-full py-3 bg-gradient-accent-h rounded-xl text-center text-white text-sm font-bold shadow-lg shadow-accent-500/20 transition-shadow hover:shadow-accent-500/35"
              >
                Open in RideWithGPS{" "}
                <svg
                  className="w-3.5 h-3.5 inline-block ml-1 -mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
