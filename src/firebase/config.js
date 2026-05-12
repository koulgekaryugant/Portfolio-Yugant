import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDxT47A_-tlCX---4i4y9QttEasNobIhfc",
  authDomain: "yugant-portfolio.firebaseapp.com",
  projectId: "yugant-portfolio",
  storageBucket: "yugant-portfolio.firebasestorage.app",
  messagingSenderId: "765537812789",
  appId: "1:765537812789:web:bb1530840cb177446d0c7c",
  measurementId: "G-SWPR0M8KWG"
};

export const firebaseEnabled = Object.values(firebaseConfig).every(Boolean);

const app = firebaseEnabled ? initializeApp(firebaseConfig) : null;

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || "yugantkoulgekar15@gmail.com";
export const resumeDocPath = import.meta.env.VITE_RESUME_DOC_PATH || "siteContent/resume";
export const staticResumePath = "/resume/latest-resume.pdf";
