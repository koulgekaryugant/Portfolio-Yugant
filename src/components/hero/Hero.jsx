import { ArrowRight, Download, Github, Linkedin, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { AVATAR_URL, personal } from "../../data/portfolio";
import { useViewMode } from "../../context/ViewModeContext";

export function Hero({ onResumeDownload, resumeMetadata }) {
  const { isHR } = useViewMode();

  return (
    <section id="home" className="section-shell grid min-h-screen items-center gap-12 pt-32 lg:grid-cols-[1.08fr_0.92fr]">
      <motion.div
        className="mode-transition"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="relative h-24 w-24 shrink-0 rounded-full bg-gradient-to-br from-cyan-300 via-blue-500 to-orange-500 p-[3px] shadow-soft [animation:ringPulse_3s_ease-in-out_infinite]">
            <img
              src={AVATAR_URL}
              alt="Yugant D Koulgekar"
              className="h-full w-full rounded-full border-4 border-ink-950 object-cover"
              loading="eager"
            />
          </div>
          <div>
            <span className="section-kicker !mb-2">Associate Developer</span>
            <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-300">
              <MapPin size={16} className="text-cyan-300" />
              {personal.location}
              <span className="h-1 w-1 rounded-full bg-slate-500" />
              {personal.company}
            </div>
          </div>
        </div>

        <h1 className="max-w-4xl font-display text-5xl font-bold leading-[1.03] tracking-tight text-white md:text-7xl">
          {personal.name}
        </h1>
        <p className="mt-6 max-w-2xl text-xl font-semibold text-cyan-100 md:text-2xl">
          {isHR
            ? "Associate Developer · Pune, India · Open to Opportunities"
            : "Building intelligent systems & scalable web solutions."}
        </p>
        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">{personal.bio}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onResumeDownload}
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 font-bold text-ink-950 transition hover:bg-cyan-200"
          >
            <Download size={18} />
            Download Resume
          </button>
          <a
            href="#projects"
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-5 py-3 font-bold text-white transition hover:border-cyan-300/70 hover:bg-slate-900"
          >
            View Projects <ArrowRight size={18} />
          </a>
        </div>
        {resumeMetadata && (
          <p className="mt-4 text-sm text-slate-400">
            Resume: <span className="font-semibold text-slate-200">{resumeMetadata.title}</span>
            {resumeMetadata.version ? ` · ${resumeMetadata.version}` : ""}
          </p>
        )}
      </motion.div>

      <motion.aside
        className="glass-card rounded-3xl p-6"
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08 }}
      >
        <div className="rounded-2xl border border-slate-700/80 bg-ink-950/70 p-5">
          <div className="mb-5 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-300">Career snapshot</span>
            <span className="rounded-full bg-cyan-300/12 px-3 py-1 text-xs font-bold text-cyan-200">Available</span>
          </div>
          <div className="grid gap-4">
            {[
              ["Role", personal.role],
              ["Focus", "Frontend, backend, automation"],
              ["Growth", "Intern -> Associate Developer"],
              ["Working style", "Agile, Git workflows, code reviews"]
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{label}</p>
                <p className="mt-2 font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex gap-3">
            <a
              href={personal.github}
              target="_blank"
              rel="noreferrer"
              className="focus-ring inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 py-3 text-sm font-bold text-slate-200 transition hover:border-cyan-300"
            >
              <Github size={17} /> GitHub
            </a>
            <a
              href={personal.linkedin}
              target="_blank"
              rel="noreferrer"
              className="focus-ring inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 py-3 text-sm font-bold text-slate-200 transition hover:border-cyan-300"
            >
              <Linkedin size={17} /> LinkedIn
            </a>
          </div>
        </div>
      </motion.aside>
    </section>
  );
}
