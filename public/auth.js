// Firebase Auth helper — loaded after Firebase SDK + config.js

import { initializeApp }       from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as fbSignOut, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseApp = initializeApp(FIREBASE_CONFIG);
const auth        = getAuth(firebaseApp);
const provider    = new GoogleAuthProvider();
provider.setCustomParameters({ hd: ALLOWED_EMAIL_DOMAIN }); // hint Google to filter to school domain

/** Sign in via Google popup. Returns the user or throws. */
async function signInWithGoogle() {
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

/** Sign out and reload. */
async function signOut() {
  await fbSignOut(auth);
  window.location.reload();
}

/** Get the current ID token (refreshed automatically by Firebase). */
async function getIdToken() {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}

/** Returns a promise that resolves with the current user (or null). */
function getCurrentUser() {
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, (user) => {
      unsub();
      resolve(user);
    });
  });
}

/** Authenticated fetch wrapper — injects the Firebase ID token into every request. */
async function apiFetch(path, options = {}) {
  const token = await getIdToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const res = await fetch(API_BASE + path, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw { status: res.status, ...data };
  return data;
}

export { auth, signInWithGoogle, signOut, getIdToken, getCurrentUser, apiFetch };