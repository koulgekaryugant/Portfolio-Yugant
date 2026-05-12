import { Mail } from "lucide-react";
import { personal } from "../../data/portfolio";
import { Section } from "../layout/Section";

export function Contact() {
  return (
    <Section id="contact" kicker="Contact" title="Let’s discuss opportunities and meaningful software work.">
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="glass-card rounded-2xl p-6">
          <p className="leading-8 text-slate-300">
            Open to full-time opportunities, product engineering conversations, and teams that value clean execution,
            ownership, and continuous improvement.
          </p>
          <a
            href={`mailto:${personal.email}`}
            className="focus-ring mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-3 font-bold text-cyan-100 transition hover:border-cyan-300"
          >
            <Mail size={18} />
            {personal.email}
          </a>
        </div>
        <form
          className="glass-card grid gap-4 rounded-2xl p-6"
          action="https://formsubmit.co/yugantkoulgekar15@gmail.com"
          method="POST"
        >
          <input type="hidden" name="_subject" value="New portfolio contact message" />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_captcha" value="false" />
          <input className="hidden" type="text" name="_honey" tabIndex="-1" autoComplete="off" />
          <Field label="Name" name="name" placeholder="Your name" />
          <Field label="Email" name="email" placeholder="you@example.com" type="email" />
          <label className="grid gap-2">
            <span className="text-sm font-bold text-slate-200">Message</span>
            <textarea
              name="message"
              rows="5"
              required
              placeholder="Tell me about the opportunity..."
              className="focus-ring rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white placeholder:text-slate-500"
            />
          </label>
          <button className="focus-ring rounded-xl bg-cyan-300 px-5 py-3 font-bold text-ink-950 transition hover:bg-cyan-200">
            Send Message
          </button>
        </form>
      </div>
    </Section>
  );
}

function Field({ label, name, type = "text", placeholder }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-slate-200">{label}</span>
      <input
        type={type}
        name={name}
        required
        placeholder={placeholder}
        className="focus-ring rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white placeholder:text-slate-500"
      />
    </label>
  );
}
