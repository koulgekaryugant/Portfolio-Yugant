import { Award, GraduationCap, ShieldCheck } from "lucide-react";
import { achievements, certifications, education } from "../data/portfolio";
import { Section } from "./layout/Section";

export function ProofPoints() {
  return (
    <Section kicker="Proof Points" title="Achievements, education, and certifications.">
      <div className="grid gap-5 md:grid-cols-3">
        <Panel icon={<Award />} title="Achievements" items={achievements} />
        <article className="glass-card rounded-2xl p-6">
          <GraduationCap className="text-cyan-300" />
          <h3 className="mt-4 font-display text-xl font-bold text-white">Education</h3>
          <p className="mt-4 text-slate-300">{education.degree}</p>
          <p className="mt-2 text-slate-300">{education.institution}</p>
          <p className="mt-3 font-bold text-cyan-100">CGPA: {education.cgpa}</p>
        </article>
        <Panel icon={<ShieldCheck />} title="Certifications" items={certifications} />
      </div>
    </Section>
  );
}

function Panel({ icon, title, items }) {
  return (
    <article className="glass-card rounded-2xl p-6">
      <div className="text-cyan-300">{icon}</div>
      <h3 className="mt-4 font-display text-xl font-bold text-white">{title}</h3>
      <ul className="mt-4 grid gap-3 text-slate-300">
        {items.map((item) => (
          <li key={item}>- {item}</li>
        ))}
      </ul>
    </article>
  );
}
