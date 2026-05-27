import { useState } from "react";
import { Mail, Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { personal } from "../../data/portfolio";
import { Section } from "../layout/Section";

export function Contact() {
  const [status, setStatus] = useState("idle");

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("loading");

    const formData = new FormData(event.target);
    formData.append("access_key", "4e08629c-406c-4403-bb43-26e68ca249e6");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setStatus(data.success ? "success" : "error");
    if (data.success) event.target.reset();
  }

  return (
    <Section id="contact" kicker="Contact" title="Let's discuss opportunities and meaningful software work.">
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

        <form onSubmit={handleSubmit} className="glass-card grid gap-4 rounded-2xl p-6">
          {/* spam protection */}
          <input type="checkbox" name="botcheck" className="hidden" style={{ display: "none" }} />

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

          {status === "success" && (
            <div className="flex items-center gap-2 rounded-xl border border-green-700 bg-green-950/50 px-4 py-3 text-sm text-green-300">
              <CheckCircle size={16} /> Sent! I'll get back to you soon.
            </div>
          )}
          {status === "error" && (
            <div className="flex items-center gap-2 rounded-xl border border-red-700 bg-red-950/50 px-4 py-3 text-sm text-red-300">
              <AlertCircle size={16} /> Something went wrong. Try emailing directly.
            </div>
          )}

          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="focus-ring flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 font-bold text-ink-950 transition hover:bg-cyan-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === "loading" ? <><Loader2 size={16} className="animate-spin" /> Sending…</>
              : status === "success" ? <><CheckCircle size={16} /> Sent!</>
              : <><Send size={16} /> Send Message</>}
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