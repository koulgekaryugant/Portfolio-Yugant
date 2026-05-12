import { motion } from "framer-motion";

const variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 }
};

export function Section({ id, kicker, title, children, className = "", as = "section" }) {
  const Component = motion[as] || motion.section;

  return (
    <Component
      id={id}
      className={`section-shell ${className}`}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.42, ease: "easeOut" }}
    >
      {(kicker || title) && (
        <div className="mb-10 max-w-3xl">
          {kicker && <span className="section-kicker">{kicker}</span>}
          {title && <h2 className="section-title">{title}</h2>}
        </div>
      )}
      {children}
    </Component>
  );
}
