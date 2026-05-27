import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Download, Github, Linkedin, MapPin, Sparkles } from "lucide-react";
import { AVATAR_URL, personal } from "../../data/portfolio";
import { useViewMode } from "../../context/ViewModeContext";

const IMAGES = [
  {
    src: "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png",
    bg: "#F4845F",
    panel: "#F79B7F"
  },
  {
    src: "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png",
    bg: "#6BBF7A",
    panel: "#85CC92"
  },
  {
    src: "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png",
    bg: "#E882B4",
    panel: "#ED9DC4"
  },
  {
    src: "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png",
    bg: "#6EB5FF",
    panel: "#8DC4FF"
  }
];

const TRANSITION_MS = 650;

function getRole(index, activeIndex) {
  const total = IMAGES.length;
  const diff = (index - activeIndex + total) % total;

  if (diff === 0) return "center";
  if (diff === 1) return "right";
  if (diff === total - 1) return "left";
  return "back";
}

function getImageStyle(role, isMobile) {
  const transition = `transform ${TRANSITION_MS}ms cubic-bezier(0.4,0,0.2,1), opacity ${TRANSITION_MS}ms cubic-bezier(0.4,0,0.2,1), filter ${TRANSITION_MS}ms cubic-bezier(0.4,0,0.2,1)`;
  const x = isMobile ? 24 : 42;

  const styles = {
    center: {
      transform: "translate3d(0, 0, 0) scale(1)",
      opacity: 1,
      zIndex: 30,
      filter: "blur(0px)"
    },
    left: {
      transform: `translate3d(-${x}%, ${isMobile ? "2%" : "4%"}, 0) scale(${isMobile ? 0.58 : 0.7})`,
      opacity: isMobile ? 0.22 : 0.42,
      zIndex: 18,
      filter: "blur(1.2px)"
    },
    right: {
      transform: `translate3d(${x}%, ${isMobile ? "2%" : "4%"}, 0) scale(${isMobile ? 0.58 : 0.7})`,
      opacity: isMobile ? 0.22 : 0.42,
      zIndex: 18,
      filter: "blur(1.2px)"
    },
    back: {
      transform: "translate3d(0, 8%, 0) scale(0.48)",
      opacity: 0,
      zIndex: 5,
      filter: "blur(4px)"
    }
  };

  return { ...styles[role], transition, willChange: "transform, opacity, filter" };
}

export function Hero({ onResumeDownload, resumeMetadata }) {
  const { isHR } = useViewMode();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(() => (typeof window === "undefined" ? false : window.innerWidth < 640));
  const animationLockRef = useRef(false);
  const animationTimerRef = useRef(null);

  const activeImage = IMAGES[activeIndex];

  useEffect(() => {
    IMAGES.forEach((item) => {
      const image = new Image();
      image.src = item.src;
    });
  }, []);

  useEffect(() => {
    const updateMobileState = () => setIsMobile(window.innerWidth < 640);
    updateMobileState();
    window.addEventListener("resize", updateMobileState);
    return () => window.removeEventListener("resize", updateMobileState);
  }, []);

  function goTo(direction) {
    if (animationLockRef.current) return;
    animationLockRef.current = true;
    setIsAnimating(true);
    setActiveIndex((current) => (current + direction + IMAGES.length) % IMAGES.length);
    window.clearTimeout(animationTimerRef.current);
    animationTimerRef.current = window.setTimeout(() => {
      animationLockRef.current = false;
      setIsAnimating(false);
    }, TRANSITION_MS);
  }

  useEffect(() => {
    const rotation = window.setInterval(() => goTo(1), 3200);
    return () => {
      window.clearInterval(rotation);
      window.clearTimeout(animationTimerRef.current);
    };
  }, []);

  const heroStyle = useMemo(
    () => ({
      "--cinema-bg": activeImage.bg,
      "--cinema-panel": activeImage.panel
    }),
    [activeImage]
  );

  return (
    <section id="home" className="cinema-hero" style={heroStyle} aria-label="Cinematic developer portfolio hero">
      <div className="cinema-hero__depth" aria-hidden="true" />
      <div className="cinema-hero__grain" aria-hidden="true" />

      <div className="cinema-hero__inner">
        <div className="cinema-hero__top">
          <div className="cinema-hero__meta">
            <MapPin size={15} />
            <span>{personal.location}</span>
          </div>
        </div>

        <div className="cinema-hero__stage">
          <div className="cinema-hero__backdrop" aria-hidden="true">
            <span className="cinema-hero__code-line">const developer = "Yugant D Koulgekar";</span>
            <span className="cinema-hero__code-line">build("scalable systems");</span>
            <span className="cinema-hero__code-line">{"ship({ clean: true, reliable: true });"}</span>
          </div>
          <div className="cinema-hero__panel" aria-hidden="true" />

          <div className="cinema-carousel" aria-live="polite">
            {IMAGES.map((image, index) => {
              const role = getRole(index, activeIndex);
              return (
                <div key={image.src} className="cinema-carousel__item" style={getImageStyle(role, isMobile)} aria-hidden={role !== "center"}>
                  <img
                    src={image.src}
                    alt={role === "center" ? "Cinematic developer identity visual" : ""}
                    className="cinema-carousel__image"
                    draggable="false"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="cinema-hero__bottom">
          <div className="cinema-hero__content">
            <div className="cinema-hero__identity">
              <div className="avatar-orbit h-16 w-16 shrink-0 rounded-full sm:h-20 sm:w-20">
                <span className="avatar-orbit__ring" aria-hidden="true" />
                <span className="avatar-orbit__aura" aria-hidden="true" />
                <img
                  src={AVATAR_URL}
                  alt="Yugant D Koulgekar"
                  className="relative z-[2] h-full w-full rounded-full border-4 border-ink-950 object-cover"
                  loading="eager"
                />
              </div>
              <div>
                <div className="cinema-hero__kicker">
                  <Sparkles size={14} />
                  Associate Developer
                </div>
                <h1>{personal.name}</h1>
              </div>
            </div>

            <p className="cinema-hero__subtitle">
              {isHR
                ? "Associate Developer - Pune, India - Open to Opportunities"
                : "Building intelligent systems & scalable web solutions."}
            </p>
            <p className="cinema-hero__bio">{personal.bio}</p>

            <div className="cinema-hero__actions">
              <button
                type="button"
                onClick={() => goTo(-1)}
                disabled={isAnimating}
                className="cinema-nav-button focus-ring"
                aria-label="Show previous carousel visual"
              >
                <ArrowLeft size={20} />
              </button>
              <button
                type="button"
                onClick={() => goTo(1)}
                disabled={isAnimating}
                className="cinema-nav-button focus-ring"
                aria-label="Show next carousel visual"
              >
                <ArrowRight size={20} />
              </button>
              <button type="button" onClick={onResumeDownload} className="cinema-resume-button focus-ring">
                <Download size={17} />
                Open Resume
              </button>
              <a href={personal.github} target="_blank" rel="noreferrer" className="cinema-social-link focus-ring" aria-label="Open GitHub profile">
                <Github size={17} />
              </a>
              <a href={personal.linkedin} target="_blank" rel="noreferrer" className="cinema-social-link focus-ring" aria-label="Open LinkedIn profile">
                <Linkedin size={17} />
              </a>
            </div>

            {resumeMetadata && (
              <p className="cinema-hero__resume-note">
                Resume: <span>{resumeMetadata.title}</span>
                {resumeMetadata.version ? ` - ${resumeMetadata.version}` : ""}
              </p>
            )}
          </div>

          <a href="#projects" className="cinema-hero__cta focus-ring">
            DISCOVER IT
            <ArrowRight size={32} />
          </a>
        </div>
      </div>
    </section>
  );
}
