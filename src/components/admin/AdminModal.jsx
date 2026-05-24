import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { CheckCircle2, FileText, LogOut, Save, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { adminEmail, auth, firebaseEnabled, staticResumePath } from "../../firebase/config";
import { clearResumeMetadata, defaultResumeMetadata, getResumeMetadata, saveResumeMetadata } from "../../firebase/resume";

export function AdminModal({ open, onClose }) {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState(adminEmail);
  const [password, setPassword] = useState("");
  const [metadata, setMetadata] = useState(defaultResumeMetadata);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!auth) return undefined;
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser?.email === adminEmail ? currentUser : null);
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    getResumeMetadata()
      .then(setMetadata)
      .catch(() => setMetadata(defaultResumeMetadata));
  }, [open]);

  if (!open) return null;

  async function handleLogin(event) {
    event.preventDefault();
    setMessage("");
    if (!firebaseEnabled || !auth) {
      setMessage("Firebase is not configured. Add your Vite environment variables first.");
      return;
    }
    if (email !== adminEmail) {
      setMessage("This admin panel is restricted to the configured admin email.");
      return;
    }
    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setPassword("");
      setMessage("Signed in successfully.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleSave(event) {
    event.preventDefault();
    setBusy(true);
    try {
      const saved = await saveResumeMetadata(metadata);
      setMetadata(saved);
      setMessage("Resume metadata updated. Replace the PDF at public/Yugant_koulgekar.pdf when needed.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleClear() {
    setBusy(true);
    try {
      await clearResumeMetadata();
      setMetadata(defaultResumeMetadata);
      setMessage("Resume metadata cleared. Public download still uses the static resume path.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  function updateField(field, value) {
    setMetadata((current) => ({ ...current, [field]: value }));
  }

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-ink-950/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="glass-card w-full max-w-xl rounded-3xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-200">Admin Only</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-white">Resume Metadata</h2>
            <p className="mt-2 text-sm text-slate-400">Shortcut: Ctrl + Shift + Y</p>
          </div>
          <button type="button" onClick={onClose} className="focus-ring rounded-full border border-slate-700 p-2 text-slate-300">
            <XCircle size={20} />
          </button>
        </div>

        {!user ? (
          <form onSubmit={handleLogin} className="mt-6 grid gap-4">
            <Field label="Admin email" type="email" value={email} onChange={setEmail} />
            <Field label="Password" type="password" value={password} onChange={setPassword} />
            <button className="focus-ring rounded-xl bg-cyan-300 px-5 py-3 font-bold text-ink-950" disabled={busy}>
              {busy ? "Signing in..." : "Sign in"}
            </button>
          </form>
        ) : (
          <div className="mt-6 grid gap-5">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/65 p-4">
              <p className="text-sm text-slate-400">Signed in as</p>
              <p className="mt-1 font-bold text-white">{user.email}</p>
            </div>

            <form onSubmit={handleSave} className="grid gap-4">
              <Field label="Resume title" value={metadata.title} onChange={(value) => updateField("title", value)} />
              <Field label="Version label" value={metadata.version} onChange={(value) => updateField("version", value)} />
              <label className="grid gap-2">
                <span className="text-sm font-bold text-slate-200">Display notes</span>
                <textarea
                  value={metadata.notes}
                  onChange={(event) => updateField("notes", event.target.value)}
                  rows="3"
                  className="focus-ring rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white"
                />
              </label>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/65 p-4 text-sm text-slate-300">
                <div className="flex items-center gap-2 font-bold text-white">
                  <FileText size={18} className="text-cyan-300" />
                  Static PDF path
                </div>
                <p className="mt-2">{staticResumePath}</p>
                <p className="mt-2 text-slate-400">Replace the actual PDF in public/Yugant_koulgekar.pdf before deploying.</p>
              </div>
              <button className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 font-bold text-ink-950" disabled={busy}>
                <Save size={18} />
                {busy ? "Saving..." : "Save Metadata"}
              </button>
            </form>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a href={staticResumePath} target="_blank" rel="noreferrer" className="focus-ring flex-1 rounded-xl border border-slate-700 px-4 py-3 text-center font-bold text-cyan-100">
                Preview static PDF
              </a>
              <button
                type="button"
                onClick={handleClear}
                className="focus-ring flex-1 rounded-xl border border-slate-700 px-4 py-3 font-bold text-slate-200"
                disabled={busy}
              >
                Clear Metadata
              </button>
              <button
                type="button"
                onClick={() => signOut(auth)}
                className="focus-ring inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-3 font-bold text-slate-200"
              >
                <LogOut size={18} />
                Sign out
              </button>
            </div>
          </div>
        )}

        {message && (
          <div className="mt-5 flex gap-3 rounded-xl border border-slate-700 bg-slate-950/70 p-4 text-sm text-slate-200">
            <CheckCircle2 className="shrink-0 text-cyan-300" size={18} />
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, type = "text", value, onChange }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-slate-200">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="focus-ring rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white"
        required
      />
    </label>
  );
}
