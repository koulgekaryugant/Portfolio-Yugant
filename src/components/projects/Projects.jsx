import { projects } from "../../data/portfolio";
import { useViewMode } from "../../context/ViewModeContext";
import { Section } from "../layout/Section";
import { ProjectCard } from "./ProjectCard";

export function Projects() {
  const { isHR } = useViewMode();
  const shownProjects = isHR ? projects : projects;

  return (
    <Section id="projects" kicker="Projects" title={isHR ? "Selected work with clear outcomes." : "Technical projects and implementation detail."}>
      <div className={isHR ? "grid gap-5 md:grid-cols-2" : "grid gap-5"}>
        {shownProjects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </Section>
  );
}
