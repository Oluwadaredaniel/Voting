// ============================================================
// FIREBASE — Public config (safe to expose, no secrets here)
// Firebase Console → Project Settings → General → Your apps → SDK setup
// ============================================================
const FIREBASE_CONFIG = {
    apiKey:            "AIzaSyDlI-2xCPsnR7dVrKMGq7oWiNieH59Nzuo",
    authDomain:        "nacos-voting-26b2b.firebaseapp.com",
    projectId:         "nacos-voting-26b2b",
    storageBucket:     "nacos-voting-26b2b.firebasestorage.app",
    messagingSenderId: "215185848058",
    appId:             "1:215185848058:web:06ee765e1d3833da25fb43",
  };
  
  // Your Express API base URL
  // Local dev:  http://localhost:3000
  // Production: https://your-app.onrender.com
  const API_BASE = "https://your-app.onrender.com";
  
  // Allowed school email domain (shown in error messages only — real enforcement is server-side)
  const ALLOWED_EMAIL_DOMAIN = "student.oauife.edu.ng";

  // ============================================================
  // CATEGORIES & NOMINEES
  // Add your real nominees here. For photos use Cloudinary:
  // cloudinary.com → free account → upload → copy URL
  // ============================================================
  const CATEGORIES = [
    {
      id: "best-dressed",
      label: "Best Dressed",
      icon: "👗",
      nominees: [
        { id: "nom-1", name: "Nominee One",   photo: "https://placehold.co/400x400/e8f5e9/1b5e20?text=1" },
        { id: "nom-2", name: "Nominee Two",   photo: "https://placehold.co/400x400/e8f5e9/1b5e20?text=2" },
        { id: "nom-3", name: "Nominee Three", photo: "https://placehold.co/400x400/e8f5e9/1b5e20?text=3" },
      ],
    },
    {
      id: "most-influential",
      label: "Most Influential",
      icon: "⭐",
      nominees: [
        { id: "nom-4", name: "Nominee Four",  photo: "https://placehold.co/400x400/e8f5e9/1b5e20?text=4" },
        { id: "nom-5", name: "Nominee Five",  photo: "https://placehold.co/400x400/e8f5e9/1b5e20?text=5" },
        { id: "nom-6", name: "Nominee Six",   photo: "https://placehold.co/400x400/e8f5e9/1b5e20?text=6" },
      ],
    },
    {
      id: "rising-star",
      label: "Rising Star",
      icon: "🚀",
      nominees: [
        { id: "nom-7", name: "Nominee Seven", photo: "https://placehold.co/400x400/e8f5e9/1b5e20?text=7" },
        { id: "nom-8", name: "Nominee Eight", photo: "https://placehold.co/400x400/e8f5e9/1b5e20?text=8" },
      ],
    },
  ];