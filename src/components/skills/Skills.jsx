import { skills } from "../../data/portfolio";
import { useViewMode } from "../../context/ViewModeContext";
import { Section } from "../layout/Section";

export function Skills() {
  const { isHR } = useViewMode();

  return (
    <Section id="skills" kicker="Technical Skills" title={isHR ? "Stack overview for quick scanning." : "Technical toolkit for product engineering."}>
      <div className={isHR ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3" : "grid gap-4 md:grid-cols-2 lg:grid-cols-5"}>
        {skills.map((skill) => (
          <article key={skill.group} className="glass-card rounded-2xl p-5">
            <h3 className="font-display text-lg font-bold text-white">{skill.group}</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {skill.items.map((item) => (
                <span key={item} className="rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1 text-sm font-semibold text-slate-300">
                  {item}
                </span>
              ))}
            </div>
            {!isHR && <div className="mt-5 h-1.5 rounded-full bg-slate-800"><div className="h-full w-4/5 rounded-full bg-cyan-300" /></div>}
          </article>
        ))}
      </div>
    </Section>
  );
}
