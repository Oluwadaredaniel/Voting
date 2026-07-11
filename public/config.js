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
  // Production: https://voting-r4rj.onrender.com
  const API_BASE = "https://voting-r4rj.onrender.com";
  
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
        { id: "nom-1", name: "Nominee A",   photo: "https://ui-avatars.com/api/?name=Nominee+A&background=e8f5e9&color=0e8c2c&size=400" },
        { id: "nom-2", name: "Nominee B",   photo: "https://ui-avatars.com/api/?name=Nominee+B&background=e8f5e9&color=0e8c2c&size=400" },
        { id: "nom-3", name: "Nominee C",   photo: "https://ui-avatars.com/api/?name=Nominee+C&background=e8f5e9&color=0e8c2c&size=400" },
      ],
    },
    {
      id: "most-influential",
      label: "Most Influential",
      icon: "⭐",
      nominees: [
        { id: "nom-4", name: "Nominee D",  photo: "https://ui-avatars.com/api/?name=Nominee+D&background=e8f5e9&color=0e8c2c&size=400" },
        { id: "nom-5", name: "Nominee E",  photo: "https://ui-avatars.com/api/?name=Nominee+E&background=e8f5e9&color=0e8c2c&size=400" },
      ],
    },
  ];