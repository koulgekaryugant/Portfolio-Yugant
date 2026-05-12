import { Section } from "../layout/Section";

export function GrowthTimeline() {
  return (
    <Section id="growth" kicker="Career Growth" title="Professional progression through performance.">
      <div className="glass-card rounded-3xl p-6 md:p-8">
        <div className="grid items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <p className="text-sm font-bold text-cyan-200">Nov 2025</p>
            <h3 className="mt-2 font-display text-2xl font-bold text-white">Intern Developer</h3>
            <p className="mt-3 text-slate-300">Hands-on product work, debugging, testing, and automation support.</p>
          </div>
          <div className="hidden h-px w-24 bg-gradient-to-r from-cyan-300 to-blue-500 md:block" />
          <div className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 p-5">
            <p className="text-sm font-bold text-cyan-200">May 2026</p>
            <h3 className="mt-2 font-display text-2xl font-bold text-white">Associate Developer</h3>
            <p className="mt-3 text-slate-300">Promoted based on consistency, ownership, and performance.</p>
          </div>
        </div>
      </div>
    </Section>
  );
}
