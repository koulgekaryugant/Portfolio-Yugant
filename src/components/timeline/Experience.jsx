import { experiences } from "../../data/portfolio";
import { useViewMode } from "../../context/ViewModeContext";
import { Section } from "../layout/Section";

export function Experience() {
  const { isHR } = useViewMode();

  return (
    <Section
      id="experience"
      kicker="Experience"
      title={isHR ? "A clear path from internship to ownership." : "Professional experience and engineering practice."}
    >
      <div className="grid gap-5">
        {experiences.map((item) => {
          const bullets = isHR ? [item.impact] : item.highlights;
          return (
            <article key={item.role} className="glass-card rounded-2xl p-6">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div>
                  <p className="text-sm font-bold text-cyan-200">{item.duration}</p>
                  <h3 className="mt-2 font-display text-2xl font-bold text-white">{item.role}</h3>
                  <p className="mt-1 font-semibold text-slate-300">{item.company}</p>
                </div>
                {item.badge && (
                  <span className="w-fit rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-xs font-bold text-cyan-100">
                    {item.badge}
                  </span>
                )}
              </div>
              <ul className="mt-5 grid gap-3 text-slate-300">
                {bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                    <span>
                      {bullet === item.impact && (
                        <strong className="mr-2 rounded-full bg-blue-500/12 px-2 py-1 text-xs text-blue-100">
                          Key Impact
                        </strong>
                      )}
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
