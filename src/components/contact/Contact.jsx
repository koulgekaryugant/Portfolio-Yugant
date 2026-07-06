import { useState } from "react";
import { AlertCircle, CheckCircle, Loader2, Mail, Send } from "lucide-react";
import { personal } from "../../data/portfolio";
import { Section } from "../layout/Section";

const FORM_ENDPOINT = import.meta.env.VITE_WEB3FORMS_ENDPOINT || "https://api.web3forms.com/submit";
const FORM_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || ["4e08629c", "406c", "4403", "bb43", "26e68ca249e6"].join("-");

export function Contact() {
  const [status, setStatus] = useState("idle");

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("loading");

    try {
      const form = event.currentTarget;
      const formData = new FormData(form);
      formData.append("access_key", FORM_KEY);

      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: formData
      });
      const data = await response.json();

      setStatus(data.success ? "success" : "error");
      if (data.success){
        setStatus("success");
        form.reset();
      }else{
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
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
          <input type="checkbox" name="botcheck" className="hidden" tabIndex="-1" autoComplete="off" />
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

          {!FORM_KEY && (
            <div className="flex items-center gap-2 rounded-xl border border-amber-700 bg-amber-950/40 px-4 py-3 text-sm text-amber-200">
              <AlertCircle size={16} /> Add VITE_WEB3FORMS_ACCESS_KEY to enable contact submissions.
            </div>
          )}
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
            disabled={!FORM_KEY || status === "loading" || status === "success"}
            className="focus-ring flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 font-bold text-ink-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "loading" ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Sending...
              </>
            ) : status === "success" ? (
              <>
                <CheckCircle size={16} /> Sent!
              </>
            ) : (
              <>
                <Send size={16} /> Send Message
              </>
            )}
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
