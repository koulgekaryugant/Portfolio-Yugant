import { Section } from "./layout/Section";

const panels = [
  ["How I Think", "I look for the system behind the symptom: data flow, edge cases, user impact, and the simplest reliable path forward."],
  ["Problems I Like", "Automation, internal systems, education platforms, and workflows where software removes repeated manual effort."],
  ["How I Learn", "I build, test, ask for feedback, improve the implementation, and keep notes from every bug that teaches me something useful."]
];

export function BeyondCode() {
  return (
    <Section kicker="Beyond Code" title="How I think, learn, and solve.">
      <div className="grid gap-5 md:grid-cols-3">
        {panels.map(([title, text]) => (
          <article key={title} className="glass-card rounded-2xl p-6">
            <h3 className="font-display text-xl font-bold text-white">{title}</h3>
            <p className="mt-4 leading-7 text-slate-300">{text}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
