import { motion } from "framer-motion";

const DIFFICULTY_STYLES = {
  easy: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/25",
  intermediate: "bg-amber-500/20 text-amber-400 border border-amber-500/25",
  advanced: "bg-orange-500/20 text-orange-400 border border-orange-500/25",
  epic: "bg-red-500/20 text-red-400 border border-red-500/25",
};

const TYPE_STYLES = {
  road: "bg-accent-500/20 text-accent-400",
  gravel: "bg-stone-500/20 text-stone-300",
};

export default function RouteCard({ route }) {
  const startShort =
    route.startLocation.split(",")[0].trim().length > 20
      ? route.startLocation.split(",")[0].trim().slice(0, 18) + "..."
      : route.startLocation.split(",")[0].trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      className="glass overflow-hidden"
    >
      {/* Badges */}
      <div className="px-5 pt-5 pb-3 flex items-center gap-2">
        <span
          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1 ${TYPE_STYLES[route.type]}`}
        >
          <svg
            className="w-3 h-3"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M5 18a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Zm0-2a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm14 2a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Zm0-2a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM12.6 5h2.15a1 1 0 0 1 .93.63l2.25 5.62a1 1 0 0 1-.93 1.37h-.04l-3.04-.07L12 14.5l-2-2.5-3.5-1L8 8.5h3l1.6-3.5Z" />
          </svg>
          {route.type}
        </span>
        <span
          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider ${DIFFICULTY_STYLES[route.difficulty]}`}
        >
          {route.difficulty}
        </span>
      </div>

      {/* Route name */}
      <div className="px-5 pb-4">
        <h3 className="text-2xl font-extrabold leading-tight">
          {route.name}
        </h3>
      </div>

      {/* Stats row */}
      <div className="mx-5 mb-4 grid grid-cols-3 divide-x divide-white/[0.06]">
        <div className="text-center py-2">
          <div className="flex justify-center mb-1.5">
            <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
            </svg>
          </div>
          <div className="text-xl font-extrabold">{route.distance}</div>
          <div className="text-[9px] text-zinc-500 uppercase tracking-wider font-semibold mt-0.5">
            Miles
          </div>
        </div>
        <div className="text-center py-2">
          <div className="flex justify-center mb-1.5">
            <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
            </svg>
          </div>
          <div className="text-xl font-extrabold">
            {route.elevation.toLocaleString()}
          </div>
          <div className="text-[9px] text-zinc-500 uppercase tracking-wider font-semibold mt-0.5">
            Ft Elev
          </div>
        </div>
        <div className="text-center py-2">
          <div className="flex justify-center mb-1.5">
            <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
          </div>
          <div className="text-sm font-bold leading-tight">{startShort}</div>
          <div className="text-[9px] text-zinc-500 uppercase tracking-wider font-semibold mt-0.5">
            Start
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      {/* Description */}
      <div className="px-5 py-4">
        <p className="text-sm text-zinc-400 leading-relaxed">
          {route.description}
        </p>
      </div>

      {/* RWGPS Button */}
      <div className="px-5 pb-4">
        <motion.a
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          href={route.rwgpsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-3 bg-gradient-accent-h rounded-xl text-center text-white text-sm font-bold shadow-lg shadow-accent-500/20 transition-shadow hover:shadow-accent-500/35"
        >
          Open in RideWithGPS{" "}
          <svg className="w-3.5 h-3.5 inline-block ml-1 -mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </motion.a>
      </div>

      {/* Highlights */}
      {route.highlights?.length > 0 && (
        <div className="px-5 pb-5 flex flex-wrap gap-1.5">
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
    </motion.div>
  );
}
