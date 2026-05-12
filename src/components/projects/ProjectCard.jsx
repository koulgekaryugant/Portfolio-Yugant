import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { useViewMode } from "../../context/ViewModeContext";

export function ProjectCard({ project }) {
  const { isHR } = useViewMode();
  const [open, setOpen] = useState(project.featured);

  return (
    <article className={`glass-card rounded-2xl p-6 ${project.featured ? "border-cyan-300/35" : ""}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          {project.label && (
            <span className="mb-3 inline-flex rounded-full bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-100">
              {project.label}
            </span>
          )}
          <h3 className="font-display text-2xl font-bold text-white">{project.title}</h3>
        </div>
        <a
          href={project.github}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${project.title} on GitHub`}
          className="focus-ring rounded-full border border-slate-700 p-2 text-slate-300 transition hover:border-cyan-300 hover:text-white"
        >
          <ExternalLink size={18} />
        </a>
      </div>
      <p className="mt-4 leading-7 text-slate-300">{project.description}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {project.tech.map((tech) => (
          <span key={tech} className="rounded-full bg-slate-950/80 px-3 py-1 text-xs font-bold text-slate-300">
            {tech}
          </span>
        ))}
      </div>

      {!isHR && (
        <>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="focus-ring mt-5 rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold text-cyan-100 transition hover:border-cyan-300"
          >
            {open ? "Hide technical detail" : "View technical detail"}
          </button>
          {open && (
            <div className="mode-transition mt-5 grid gap-4 border-t border-slate-800 pt-5 md:grid-cols-2">
              <Detail title="Problem" body={project.problem} />
              <Detail title="Solution" body={project.solution} />
              <div>
                <h4 className="font-bold text-white">Features</h4>
                <ul className="mt-2 grid gap-2 text-sm text-slate-300">
                  {project.features.map((feature) => (
                    <li key={feature}>- {feature}</li>
                  ))}
                </ul>
              </div>
              <Detail title="Learning outcome" body={project.learning} />
            </div>
          )}
        </>
      )}
    </article>
  );
}

function Detail({ title, body }) {
  return (
    <div>
      <h4 className="font-bold text-white">{title}</h4>
      <p className="mt-2 text-sm leading-6 text-slate-300">{body}</p>
    </div>
  );
}
