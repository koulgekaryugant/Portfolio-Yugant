import { Brain, BriefcaseBusiness, TrendingUp } from "lucide-react";
import { Section } from "./layout/Section";

const cards = [
  {
    title: "Problem Solving",
    icon: Brain,
    text: "Breaks unclear requirements into practical steps, isolates bottlenecks, and focuses on reliable outcomes."
  },
  {
    title: "Real-World Experience",
    icon: BriefcaseBusiness,
    text: "Hands-on exposure to frontend, backend, automation, debugging, Agile workflows, and code reviews."
  },
  {
    title: "Continuous Learning Mindset",
    icon: TrendingUp,
    text: "Demonstrated growth through promotion from intern to associate developer based on performance."
  }
];

export function WhyHireMe() {
  return (
    <Section id="why-hire" kicker="Why Hire Me" title="A practical engineer with visible growth and ownership.">
      <div className="grid gap-5 md:grid-cols-3">
        {cards.map(({ title, icon: Icon, text }) => (
          <article key={title} className="glass-card rounded-2xl p-6 transition hover:-translate-y-1 hover:border-cyan-300/45">
            <Icon className="text-cyan-300" />
            <h3 className="mt-5 font-display text-xl font-bold text-white">{title}</h3>
            <p className="mt-3 leading-7 text-slate-300">{text}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
