import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity, BookOpen, Calendar, ChevronRight, Code2,
  ExternalLink, Flame, Github, GitCommit, GitFork,
  Maximize2, Minimize2, RefreshCw, Star, TrendingUp,
  Users, X
} from "lucide-react";
import { getGitHubStats } from "../../services/github";
import { useGitHubStats } from "../../context/GitHubStatsContext";

/* ── Language colours ─────────────────────────────────────────── */
const LANG_COLORS = {
  JavaScript: "#f1e05a", TypeScript: "#3178c6", HTML: "#e34c26",
  CSS: "#563d7c", Python: "#3572a5", Go: "#00add8", Rust: "#dea584",
  "C++": "#f34b7d", C: "#555555", Java: "#b07219", Ruby: "#701516",
  Shell: "#89e051", PHP: "#4f5d95", Swift: "#f05138",
};
const getLangColor = (l) => LANG_COLORS[l] || "#858585";

/* ── Layout constants ─────────────────────────────────────────── */
const MOBILE_BREAKPOINT = 768;
const MIN_W = 420, MIN_H = 340;
const DEFAULT_W = 680, DEFAULT_H = 540;
const TITLEBAR_H = 44;

/* ── Clamp helper ─────────────────────────────────────────────── */
function clamp(val, lo, hi) { return Math.max(lo, Math.min(hi, val)); }

/* ── Initial position (bottom-right with padding) ─────────────── */
function getInitialPos(w, h) {
  if (typeof window === "undefined") return { x: 24, y: 80 };
  return {
    x: Math.max(16, window.innerWidth - w - 24),
    y: Math.max(72, window.innerHeight - h - 24),
  };
}

/* ──────────────────────────────────────────────────────────────── */
export function GitHubAnalytics() {
  const { isOpen, setIsOpen } = useGitHubStats();

  /* ── Stats data state ─────────────────────────────────────── */
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  /* ── Window state ─────────────────────────────────────────── */
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT
  );
  const [size, setSize] = useState({ w: DEFAULT_W, h: DEFAULT_H });
  const [pos, setPos] = useState(() => getInitialPos(DEFAULT_W, DEFAULT_H));

  /* ── Drag refs ────────────────────────────────────────────── */
  const dragRef = useRef(null);           // { startMouseX, startMouseY, startPosX, startPosY }
  const resizeRef = useRef(null);         // { dir, startX, startY, startW, startH, startPosX, startPosY }
  const isDragging = useRef(false);
  const isResizing = useRef(false);
  const rootRef = useRef(null);

  /* ── Responsive: detect mobile ───────────────────────────── */
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* ── Fetch GitHub stats ───────────────────────────────────── */
  const fetchStats = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      setStats(await getGitHubStats());
    } catch (e) {
      setError("Failed to fetch live GitHub statistics. Check network or add VITE_GITHUB_TOKEN.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  /* ── Date helpers ─────────────────────────────────────────── */
  const formatDate = (s) =>
    s ? new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

  const relTime = (s) => {
    if (!s) return "";
    const d = Math.floor((Date.now() - new Date(s)) / 86400000);
    const h = Math.floor((Date.now() - new Date(s)) / 3600000);
    const m = Math.floor((Date.now() - new Date(s)) / 60000);
    if (d > 0) return `${d}d ago`;
    if (h > 0) return `${h}h ago`;
    if (m > 0) return `${m}m ago`;
    return "just now";
  };

  /* ── Heatmap weeks ────────────────────────────────────────── */
  const heatmapWeeks = useMemo(() => {
    const raw = stats?.contributionHeatmap ?? [];
    const weeks = [];
    for (let i = 0; i < raw.length; i += 7) { const w = raw.slice(i, i + 7); if (w.length) weeks.push(w); }
    return weeks;
  }, [stats]);

  /* ── Language doughnut ────────────────────────────────────── */
  const langChart = useMemo(() => {
    if (!stats?.topLanguages?.length) return [];
    const circ = 2 * Math.PI * 50;
    let acc = 0;
    return stats.topLanguages.map((l) => {
      const rot = (acc / 100) * 360 - 90;
      acc += l.percent;
      return {
        ...l, color: getLangColor(l.name),
        strokeDasharray: circ,
        strokeDashoffset: circ - (l.percent / 100) * circ,
        rotation: rot,
      };
    });
  }, [stats]);

  /* ── Trend chart paths ────────────────────────────────────── */
  const trend = useMemo(() => {
    const T = stats?.contributionTrends ?? [];
    if (!T.length) return null;
    const W = 500, H = 140, PAD = 15;
    const max = Math.max(...T.map(t => t.count), 1);
    const pts = T.map((t, i) => ({
      x: PAD + (i / (T.length - 1)) * (W - PAD * 2),
      y: H - PAD - (t.count / max) * (H - PAD * 2),
      count: t.count, label: t.label,
    }));
    const line = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    const area = `${line} L ${pts.at(-1).x} ${H - PAD} L ${pts[0].x} ${H - PAD} Z`;
    return { pts, line, area, W, H, PAD };
  }, [stats]);

  /* ════════════════════════════════════════════════════════════
     DRAG LOGIC
  ════════════════════════════════════════════════════════════ */
  const onTitlebarMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    isDragging.current = true;
    dragRef.current = {
      startMouseX: e.clientX, startMouseY: e.clientY,
      startPosX: pos.x, startPosY: pos.y,
    };
    rootRef.current?.classList.add("fw-root--dragging");

    const onMove = (ev) => {
      if (!isDragging.current) return;
      const d = dragRef.current;
      const dx = ev.clientX - d.startMouseX;
      const dy = ev.clientY - d.startMouseY;
      const maxX = window.innerWidth - size.w;
      const maxY = window.innerHeight - (isMinimized ? TITLEBAR_H : size.h);
      setPos({ x: clamp(d.startPosX + dx, 0, maxX), y: clamp(d.startPosY + dy, 0, maxY) });
    };
    const onUp = () => {
      isDragging.current = false;
      rootRef.current?.classList.remove("fw-root--dragging");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [pos, size, isMinimized]);

  /* ════════════════════════════════════════════════════════════
     RESIZE LOGIC
  ════════════════════════════════════════════════════════════ */
  const onResizeMouseDown = useCallback((dir) => (e) => {
    e.preventDefault(); e.stopPropagation();
    isResizing.current = true;
    resizeRef.current = {
      dir,
      startX: e.clientX, startY: e.clientY,
      startW: size.w, startH: size.h,
      startPX: pos.x, startPY: pos.y,
    };

    const onMove = (ev) => {
      if (!isResizing.current) return;
      const r = resizeRef.current;
      const dx = ev.clientX - r.startX;
      const dy = ev.clientY - r.startY;
      let newW = r.startW, newH = r.startH, newX = r.startPX, newY = r.startPY;

      if (dir.includes("e")) newW = clamp(r.startW + dx, MIN_W, window.innerWidth - r.startPX);
      if (dir.includes("s")) newH = clamp(r.startH + dy, MIN_H, window.innerHeight - r.startPY);
      if (dir.includes("w")) {
        const candidate = clamp(r.startW - dx, MIN_W, window.innerWidth);
        newX = clamp(r.startPX + (r.startW - candidate), 0, r.startPX + r.startW - MIN_W);
        newW = r.startW + r.startPX - newX;
      }
      if (dir.includes("n")) {
        const candidate = clamp(r.startH - dy, MIN_H, window.innerHeight);
        newY = clamp(r.startPY + (r.startH - candidate), 0, r.startPY + r.startH - MIN_H);
        newH = r.startH + r.startPY - newY;
      }

      setSize({ w: newW, h: newH });
      setPos({ x: newX, y: newY });
    };

    const onUp = () => {
      isResizing.current = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [size, pos]);

  /* ── Clamp position when viewport shrinks ─────────────────── */
  useEffect(() => {
    const onVpResize = () => {
      setPos(p => ({
        x: clamp(p.x, 0, Math.max(0, window.innerWidth - size.w)),
        y: clamp(p.y, 0, Math.max(0, window.innerHeight - (isMinimized ? TITLEBAR_H : size.h))),
      }));
    };
    window.addEventListener("resize", onVpResize);
    return () => window.removeEventListener("resize", onVpResize);
  }, [size, isMinimized]);

  /* ══════════════════════════════════════════════════════════
     CONTENT (shared between desktop window and mobile sheet)
  ══════════════════════════════════════════════════════════ */
  const DashboardContent = (
    <div className="space-y-5 p-4">

      {/* ① Key metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {[
          { icon: <BookOpen size={16} className="text-cyan-400"/>, label:"Repositories", value: stats?.totalRepos },
          { icon: <Users size={16} className="text-blue-400"/>, label:"Followers", value: stats?.followers },
          { icon: <Users size={16} className="text-purple-400"/>, label:"Following", value: stats?.following },
          { icon: <TrendingUp size={16} className="text-emerald-400"/>, label:"Contributions", value: stats?.totalContributions },
          { icon: <Flame size={16} className="text-orange-400"/>, label:"Streak", value: `${stats?.contributionStreak ?? "—"} days` },
        ].map(({ icon, label, value }) => (
          <div key={label} className="flex flex-col gap-1.5 rounded-xl border border-slate-800/60 p-3 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold truncate">{label}</span>
              {icon}
            </div>
            <span className="text-base font-semibold text-white">{value ?? "—"}</span>
          </div>
        ))}
      </div>

      {/* ② Heatmap + Language */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Heatmap */}
        <div className="sm:col-span-2 rounded-xl border border-slate-800/60 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="flex items-center gap-1.5 text-xs font-semibold text-white">
              <Calendar size={13} className="text-cyan-400"/> Contribution Heatmap
            </h3>
            {hoveredDay && (
              <span className="text-[10px] text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-md">
                {hoveredDay.count} on {formatDate(hoveredDay.date)}
              </span>
            )}
          </div>
          <div className="overflow-x-auto pb-1">
            <div className="flex gap-[3px] min-w-max">
              {heatmapWeeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[3px]">
                  {week.map((day) => {
                    let cls = "bg-slate-800/30";
                    if (day.count > 0 && day.count <= 2)  cls = "bg-cyan-500/40 shadow-[0_0_6px_rgba(6,182,212,0.2)]";
                    else if (day.count > 2 && day.count <= 5) cls = "bg-cyan-400/70";
                    else if (day.count > 5) cls = "bg-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.4)]";
                    return (
                      <div
                        key={day.date}
                        className={`h-[10px] w-[10px] rounded-[2px] transition-transform hover:scale-125 cursor-pointer ${cls}`}
                        onMouseEnter={() => setHoveredDay(day)}
                        onMouseLeave={() => setHoveredDay(null)}
                        title={`${day.count} contributions · ${day.date}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-end gap-1.5 mt-2 text-[9px] text-slate-500">
            <span>Less</span>
            {["bg-slate-800/30","bg-cyan-500/40","bg-cyan-400/70","bg-cyan-300"].map(c=>(
              <div key={c} className={`h-[8px] w-[8px] rounded-[2px] ${c}`}/>
            ))}
            <span>More</span>
          </div>
        </div>

        {/* Languages */}
        <div className="rounded-xl border border-slate-800/60 p-4">
          <h3 className="flex items-center gap-1.5 text-xs font-semibold text-white mb-3">
            <Code2 size={13} className="text-blue-400"/> Languages
          </h3>
          {langChart.length > 0 ? (
            <div className="flex flex-col items-center gap-3">
              <div className="relative h-24 w-24">
                <svg viewBox="0 0 120 120" className="h-full w-full">
                  {langChart.map((l, i) => (
                    <circle key={i} cx="60" cy="60" r="50" fill="transparent"
                      stroke={l.color} strokeWidth="12"
                      strokeDasharray={l.strokeDasharray} strokeDashoffset={l.strokeDashoffset}
                      transform={`rotate(${l.rotation} 60 60)`}
                      className="transition-all duration-300 hover:stroke-[14]"
                    />
                  ))}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-[9px] text-slate-400 uppercase">Top</span>
                  <span className="text-[11px] font-semibold text-white">{langChart[0]?.name}</span>
                </div>
              </div>
              <div className="w-full space-y-1.5">
                {langChart.slice(0,5).map(l=>(
                  <div key={l.name} className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{background:l.color}}/>
                      <span className="text-slate-300">{l.name}</span>
                    </div>
                    <span className="text-slate-400">{l.percent}%</span>
                  </div>
                ))}
              </div>
            </div>
          ) : <div className="py-6 text-center text-xs text-slate-400">No data</div>}
        </div>
      </div>

      {/* ③ Trends + Activity */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Trends chart */}
        <div className="sm:col-span-2 rounded-xl border border-slate-800/60sm:col-span-2 rounded-xl border border-slate-800/60 p-4 p-4">
          <h3 className="flex items-center gap-1.5 text-xs font-semibold text-white mb-4">
            <TrendingUp size={13} className="text-emerald-400"/> Weekly Contribution Trends
          </h3>
          {trend ? (
            <div className="relative">
              {hoveredPoint && (
                <div
                  className="absolute z-20 pointer-events-none rounded-lg border border-slate-700 bg-slate-900/95 px-2.5 py-1.5 text-[10px] backdrop-blur-sm shadow-premium"
                  style={{
                    left: `${(hoveredPoint.x / trend.W) * 100}%`,
                    top: `${(hoveredPoint.y / trend.H) * 100}%`,
                    transform: "translate(-50%, calc(-100% - 12px))",
                  }}
                >
                  <div className="font-semibold text-cyan-300 text-center">{hoveredPoint.count} contributions</div>
                  <div className="text-[9px] text-slate-400 text-center mt-0.5">Week of {hoveredPoint.label}</div>
                </div>
              )}
              <svg className="w-full overflow-visible" viewBox={`0 0 ${trend.W} ${trend.H}`} preserveAspectRatio="none">
                <defs>
                  <linearGradient id="fwAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.2"/>
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="fwLineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#22d3ee"/>
                    <stop offset="100%" stopColor="#3b82f6"/>
                  </linearGradient>
                </defs>
                {[15, 62.5, 110].map(y=>(
                  <line key={y} x1="15" y1={y} x2="485" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
                ))}
                {hoveredPoint && (
                  <line x1={hoveredPoint.x} y1={trend.H-trend.PAD} x2={hoveredPoint.x} y2={hoveredPoint.y}
                    stroke="rgba(34,211,238,0.35)" strokeWidth="1.5" strokeDasharray="4,4"/>
                )}
                <path d={trend.area} fill="url(#fwAreaGrad)"/>
                <path d={trend.line} fill="none" stroke="url(#fwLineGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                {trend.pts.map((p,i)=>(
                  <g key={i} onMouseEnter={()=>setHoveredPoint(p)} onMouseLeave={()=>setHoveredPoint(null)} className="cursor-pointer">
                    <circle cx={p.x} cy={p.y} r="12" fill="transparent"/>
                    <circle cx={p.x} cy={p.y}
                      r={hoveredPoint?.x === p.x ? 5.5 : 3.5}
                      fill="#0f172a" stroke="#22d3ee"
                      strokeWidth={hoveredPoint?.x === p.x ? 2.5 : 2}
                      className="transition-all duration-100"
                    />
                  </g>
                ))}
              </svg>
              <div className="flex justify-between text-[9px] text-slate-500 mt-1">
                <span>{trend.pts[0]?.label}</span>
                <span>{trend.pts[Math.floor(trend.pts.length/2)]?.label}</span>
                <span>{trend.pts.at(-1)?.label}</span>
              </div>
            </div>
          ) : <div className="py-8 text-center text-xs text-slate-400">No trend data</div>}
        </div>

        {/* Recent activity */}
        <div className="rounded-xl border border-slate-800/60 p-4">
          <h3 className="flex items-center gap-1.5 text-xs font-semibold text-white mb-3">
            <Activity size={13} className="text-purple-400"/> Recent Activity
          </h3>
          <div className="space-y-3">
            {stats?.recentActivity?.slice(0,6).map((a,i)=>(
              <div key={i} className="flex items-start gap-2 text-[10px]">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-slate-800/60">
                  {a.type==="Push" ? <GitCommit size={11} className="text-cyan-400"/> : <Activity size={11}/>}
                </span>
                <div className="min-w-0">
                  <p className="text-slate-300 truncate">{a.type} <span className="text-slate-500">→</span> {a.repo}</p>
                  <span className="text-slate-500">{relTime(a.date)}</span>
                </div>
              </div>
            )) ?? <p className="text-xs text-slate-500 text-center py-4">No recent activity</p>}
          </div>
        </div>
      </div>

      {/* ④ Top repositories */}
      <div>
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-2 mb-3">
          <h3 className="flex items-center gap-1.5 text-xs font-semibold text-white">
            <Star size={13} className="text-yellow-400"/> Top Repositories
          </h3>
          {stats?.profileUrl && (
            <a href={stats.profileUrl} target="_blank" rel="noreferrer"
              className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-cyan-300 transition">
              View all <ExternalLink size={10}/>
            </a>
          )}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {stats?.repositoryStats?.map(r=>(
            <a key={r.name} href={r.url} target="_blank" rel="noreferrer"
              className="group flex flex-col justify-between rounded-xl border border-slate-800/60 p-3 transition-all hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-900/30">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white group-hover:text-cyan-300 transition truncate">{r.name}</span>
                  <ChevronRight size={12} className="text-slate-500 group-hover:text-cyan-300 transition-transform group-hover:translate-x-0.5"/>
                </div>
                <p className="mt-1 text-[10px] text-slate-400 line-clamp-2">{r.description || "No description."}</p>
              </div>
              <div className="flex items-center justify-between mt-2.5 text-[10px] text-slate-500">
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full" style={{background:getLangColor(r.language)}}/>
                  <span>{r.language}</span>
                </div>
                <div className="flex gap-2">
                  <span className="flex items-center gap-0.5"><Star size={10} className="text-yellow-500/80"/>{r.stars}</span>
                  <span className="flex items-center gap-0.5"><GitFork size={10}/>{r.forks}</span>
                </div>
              </div>
            </a>
          )) ?? null}
        </div>
      </div>

      {/* ⑤ Commits timeline */}
      <div>
        <h3 className="flex items-center gap-1.5 text-xs font-semibold text-white border-b border-slate-800/60 pb-2 mb-3">
          <GitCommit size={13} className="text-cyan-400"/> Latest Commits
        </h3>
        <div className="relative border-l border-slate-800/80 pl-5 space-y-4">
          {stats?.recentCommits?.slice(0,6).map((c,i)=>(
            <div key={i} className="relative group">
              <span className="absolute -left-[27px] top-1 h-2 w-2 rounded-full bg-slate-700 ring-4 ring-[rgba(7,17,31,0.9)] group-hover:bg-cyan-400 transition-colors"/>
              <div className="flex flex-col gap-1 text-[10px] sm:flex-row sm:justify-between sm:items-center">
                <div className="min-w-0 flex-1">
                  <a href={c.url} target="_blank" rel="noreferrer"
                    className="font-medium text-slate-200 hover:text-cyan-300 transition truncate block">{c.message}</a>
                  <span className="rounded bg-slate-800/60 px-1.5 py-0.5 text-[9px] text-slate-400 uppercase tracking-wide mt-0.5 inline-block">{c.repo}</span>
                </div>
                <span className="text-slate-500 shrink-0">{relTime(c.date)}</span>
              </div>
            </div>
          )) ?? <p className="text-xs text-slate-500 py-4">No commits found</p>}
        </div>
      </div>

      {/* Footer */}
      {stats && (
        <div className="border-t border-slate-800/50 pt-3 flex flex-col gap-1 sm:flex-row sm:justify-between text-[9px] text-slate-500">
          <span>{stats.contributionSource}</span>
          <span>Refreshes every 5 min · session-cached</span>
        </div>
      )}
    </div>
  );

  /* ════════════════════════════════════════════════════════════
     RENDER: Mobile → bottom sheet
  ════════════════════════════════════════════════════════════ */
  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fw-mobile-backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="fw-mobile-sheet"
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="fw-mobile-sheet__drag-handle"/>
              <div className="fw-mobile-sheet__titlebar">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 text-ink-950">
                    <Github size={15}/>
                  </span>
                  <span className="fw-title">GitHub Live Analytics</span>
                  <span className="fw-live">Live</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={fetchStats} disabled={loading}
                    className="focus-ring flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:text-white transition"
                    type="button" title="Refresh">
                    <RefreshCw size={13} className={loading ? "animate-spin" : ""}/>
                  </button>
                  <button onClick={() => setIsOpen(false)}
                    className="focus-ring flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:text-white transition"
                    type="button" title="Close">
                    <X size={14}/>
                  </button>
                </div>
              </div>
              <div className="fw-mobile-sheet__content">
                {loading ? <LoadingState/> : error ? <ErrorState error={error} onRetry={fetchStats}/> : DashboardContent}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  /* ════════════════════════════════════════════════════════════
     RENDER: Desktop → floating window
  ════════════════════════════════════════════════════════════ */
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={rootRef}
          className={`fw-root ${isMinimized ? "fw-root--minimized" : ""}`}
          style={{
            left: pos.x,
            top: pos.y,
            width: size.w,
            height: isMinimized ? TITLEBAR_H : size.h,
          }}
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 12 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Titlebar */}
          <div className="fw-titlebar" onMouseDown={onTitlebarMouseDown}>
            {/* Traffic-light buttons */}
            <div className="fw-traffic" onMouseDown={e => e.stopPropagation()}>
              <button type="button" className="fw-btn fw-btn--close" title="Close" onClick={() => setIsOpen(false)}/>
              <button type="button" className="fw-btn fw-btn--min" title={isMinimized ? "Restore" : "Minimize"}
                onClick={() => setIsMinimized(v => !v)}/>
              <button type="button" className="fw-btn fw-btn--restore" title="Restore default size"
                onClick={() => { setSize({w:DEFAULT_W, h:DEFAULT_H}); setPos(getInitialPos(DEFAULT_W, DEFAULT_H)); setIsMinimized(false); }}/>
            </div>

            {/* Title */}
            <div className="fw-title">
              <span className="grid h-6 w-6 place-items-center rounded-md bg-gradient-to-br from-cyan-400 to-blue-500 text-ink-950 shrink-0">
                <Github size={13}/>
              </span>
              GitHub Live Analytics
            </div>

            {/* Live badge */}
            <span className="fw-live">Live</span>

            {/* Actions */}
            <div className="fw-title-actions" onMouseDown={e => e.stopPropagation()}>
              <button type="button" onClick={fetchStats} disabled={loading}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition"
                title="Refresh">
                <RefreshCw size={12} className={loading ? "animate-spin" : ""}/>
              </button>
              {stats?.profileUrl && (
                <a href={stats.profileUrl} target="_blank" rel="noreferrer"
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition"
                  title="View GitHub Profile" onMouseDown={e=>e.stopPropagation()}>
                  <ExternalLink size={12}/>
                </a>
              )}
              <button type="button" onClick={() => setIsMinimized(v=>!v)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition"
                title={isMinimized ? "Restore" : "Minimize"}>
                {isMinimized ? <Maximize2 size={12}/> : <Minimize2 size={12}/>}
              </button>
            </div>
          </div>

          {/* Content */}
          {!isMinimized && (
            <div className="fw-content">
              {loading ? <LoadingState/> : error ? <ErrorState error={error} onRetry={fetchStats}/> : DashboardContent}
            </div>
          )}

          {/* Resize handles — hidden when minimized */}
          {!isMinimized && (
            <>
              <div className="fw-resize fw-resize--n" onMouseDown={onResizeMouseDown("n")}/>
              <div className="fw-resize fw-resize--e" onMouseDown={onResizeMouseDown("e")}/>
              <div className="fw-resize fw-resize--s" onMouseDown={onResizeMouseDown("s")}/>
              <div className="fw-resize fw-resize--w" onMouseDown={onResizeMouseDown("w")}/>
              <div className="fw-resize fw-resize--se" onMouseDown={onResizeMouseDown("se")}/>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Utility sub-components ─────────────────────────────────── */
function LoadingState() {
  return (
    <div className="animate-pulse p-4 space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[...Array(3)].map((_,i)=><div key={i} className="h-16 rounded-xl bg-slate-800/40"/>)}
      </div>
      <div className="h-36 rounded-xl bg-slate-800/40"/>
      <div className="grid grid-cols-2 gap-3">
        {[...Array(2)].map((_,i)=><div key={i} className="h-24 rounded-xl bg-slate-800/40"/>)}
      </div>
    </div>
  );
}

function ErrorState({ error, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 px-4 text-center">
      <p className="text-xs text-red-400 max-w-xs">{error}</p>
      <button type="button" onClick={onRetry}
        className="focus-ring flex items-center gap-1.5 rounded-xl bg-cyan-300 px-4 py-2 text-xs font-semibold text-ink-950 hover:bg-cyan-200 transition">
        <RefreshCw size={13}/> Retry
      </button>
    </div>
  );
}
