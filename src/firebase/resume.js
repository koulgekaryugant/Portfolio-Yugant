import { deleteDoc, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db, resumeDocPath, staticResumePath } from "./config";

export const defaultResumeMetadata = {
  title: "Yugant D Koulgekar - Resume",
  fileName: "latest-resume.pdf",
  downloadPath: staticResumePath,
  version: "Latest",
  notes: "Professional resume for recruiter review."
};

function resumeDocRef() {
  if (!db) return null;
  const [collectionName, documentId] = resumeDocPath.split("/");
  return doc(db, collectionName, documentId);
}

export async function getResumeMetadata() {
  const target = resumeDocRef();
  if (!target) return defaultResumeMetadata;

  const snapshot = await getDoc(target);
  if (!snapshot.exists()) return defaultResumeMetadata;

  return {
    ...defaultResumeMetadata,
    ...snapshot.data(),
    downloadPath: staticResumePath
  };
}

export async function getResumeUrl() {
  const metadata = await getResumeMetadata();
  return metadata.downloadPath || staticResumePath;
}

export async function saveResumeMetadata(metadata) {
  const target = resumeDocRef();
  if (!target) throw new Error("Firestore is not configured.");

  const cleanMetadata = {
    title: metadata.title?.trim() || defaultResumeMetadata.title,
    fileName: "latest-resume.pdf",
    downloadPath: staticResumePath,
    version: metadata.version?.trim() || defaultResumeMetadata.version,
    notes: metadata.notes?.trim() || defaultResumeMetadata.notes,
    updatedAt: serverTimestamp()
  };

  await setDoc(target, cleanMetadata, { merge: true });
  return cleanMetadata;
}

export async function clearResumeMetadata() {
  const target = resumeDocRef();
  if (!target) throw new Error("Firestore is not configured.");
  await deleteDoc(target);
}
