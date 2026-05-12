# Yugant D Koulgekar Portfolio

Professional React portfolio for Yugant D Koulgekar, built with Vite, Tailwind CSS, Framer Motion, Firebase Auth, and Firestore.

## Features

- Recruiter-first HR Mode and technical Developer Mode
- Persistent mode preference with `localStorage`
- Professional dark theme with cyan/blue accents
- Public resume download from `public/resume/latest-resume.pdf`
- Firestore-only resume metadata management
- Hidden admin metadata panel opened with `Ctrl + Shift + Y`
- Firebase Email/Password admin authentication
- Responsive project cards with technical expansion in Developer Mode
- Contact form using FormSubmit
- Accessible navigation and controls

## Setup

```bash
npm install
copy .env.example .env.local
npm run dev
```

Fill `.env.local` with Firebase project values.

## Resume Workflow

The actual resume PDF is stored as a static file:

```text
public/resume/latest-resume.pdf
```

To replace the public resume, overwrite that file and redeploy to Vercel.

The admin panel does not upload PDFs. It only manages Firestore metadata used by the UI:

- Resume title
- Version label
- Display notes
- Fixed download path: `/resume/latest-resume.pdf`

## Firebase Setup

1. Create a Firebase project.
2. Enable Email/Password Authentication.
3. Create the admin user with the email in `VITE_ADMIN_EMAIL`.
4. Enable Firestore Database.
5. Deploy `firebase.rules` as Firestore rules.

The app reads/writes one Firestore document by default:

```text
siteContent/resume
```

Public users can read resume metadata. Only the configured admin email can write or delete it.

## Admin Resume Metadata

- Press `Ctrl + Shift + Y`.
- Sign in with the configured admin email.
- Update title, version label, and display notes.
- Public users can only download the static latest resume PDF.

## Vercel Deployment

1. Push the project to GitHub.
2. Import the repository in Vercel.
3. Set these environment variables in Vercel:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_ADMIN_EMAIL`
   - `VITE_RESUME_DOC_PATH`
4. Build command: `npm run build`
5. Output directory: `dist`

## Security Notes

Firebase web config values are safe to expose in a frontend app when Authentication and Firestore rules are configured correctly. Do not store service account keys or private secrets in Vite environment variables.
