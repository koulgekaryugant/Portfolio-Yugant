import { MessageCircle, X } from "lucide-react";
import { useState } from "react";

const answers = {
  about:
    "Yugant is an Associate Developer at Paexskin Solutions in Pune, focused on scalable web solutions, automation, and continuous learning.",
  skills:
    "Core skills include Python, Java, PHP, HTML, CSS, JavaScript, Angular, SQL databases, MongoDB, AWS, Azure DevOps, Git, Postman, and Figma.",
  hire:
    "He brings real project exposure, a documented intern-to-associate promotion, collaborative development habits, and a practical problem-solving mindset.",
  projects:
    "Key projects include EduNitor, Face Recognition Attendance, Proctored Examination Tool, and Online Voting System, with EduNitor as the featured award-winning project."
};

const prompts = [
  ["about", "Tell me about Yugant"],
  ["skills", "Show skills"],
  ["hire", "Why hire him?"],
  ["projects", "Explain projects"]
];

export function AIGuide() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ type: "bot", text: "Ask a quick recruiter-style question." }]);

  function ask(key, label) {
    setMessages((items) => [...items, { type: "user", text: label }, { type: "bot", text: answers[key] }]);
  }

  return (
    <aside className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-4 w-[min(360px,calc(100vw-32px))] rounded-2xl border border-slate-700 bg-ink-900/95 p-4 shadow-premium backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-white">Portfolio Guide</h2>
              <p className="text-xs text-slate-400">Frontend assistant</p>
            </div>
            <button className="focus-ring rounded-full p-2 text-slate-300" onClick={() => setOpen(false)} aria-label="Close portfolio guide">
              <X size={18} />
            </button>
          </div>
          <div className="grid max-h-64 gap-2 overflow-auto pr-1">
            {messages.map((message, index) => (
              <p
                key={`${message.type}-${index}`}
                className={`rounded-xl px-3 py-2 text-sm leading-6 ${
                  message.type === "bot" ? "bg-slate-950 text-slate-200" : "justify-self-end bg-cyan-300 text-ink-950"
                }`}
              >
                {message.text}
              </p>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {prompts.map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => ask(key, label)}
                className="focus-ring rounded-xl border border-slate-700 px-3 py-2 text-xs font-bold text-slate-200 transition hover:border-cyan-300"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="focus-ring grid h-14 w-14 place-items-center rounded-full bg-cyan-300 text-ink-950 shadow-soft transition hover:bg-cyan-200"
        aria-label="Open portfolio guide"
        aria-expanded={open}
      >
        <MessageCircle size={22} />
      </button>
    </aside>
  );
}
