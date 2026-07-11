import "dotenv/config";
import express from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion } from "mongodb";
import admin from "firebase-admin";

// ─── Firebase Admin init ───────────────────────────────────────────────────
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

// ─── MongoDB init ──────────────────────────────────────────────────────────
const mongoClient = new MongoClient(process.env.MONGODB_URI, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
  maxPoolSize: 20,          // handles concurrent requests
  minPoolSize: 2,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 10000,
});

let db;
async function connectDB() {
  await mongoClient.connect();
  db = mongoClient.db("nacos-voting");

  // Unique index — this is the core fraud prevention.
  // MongoDB will reject a second insert with the same voterId + categoryId.
  await db.collection("votes").createIndex(
    { voterId: 1, categoryId: 1 },
    { unique: true, name: "one_vote_per_category" }
  );

  console.log("✅ MongoDB connected");
}

// ─── Express setup ─────────────────────────────────────────────────────────
const app = express();
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  methods: ["GET", "POST"],
}));

// Serve frontend static files (public/ folder)
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(join(__dirname, "../public")));

// ─── Auth middleware ───────────────────────────────────────────────────────
// Verifies the Firebase ID token sent in Authorization: Bearer <token>
// Enforces the school email domain server-side — cannot be bypassed.
async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token  = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Not signed in." });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const email   = decoded.email || "";
    const domain  = process.env.ALLOWED_EMAIL_DOMAIN;

    if (domain && !email.endsWith("@" + domain)) {
      return res.status(403).json({
        error: `Only @${domain} accounts can vote.`,
        wrongDomain: true,
      });
    }

    req.user = { uid: decoded.uid, email };
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid or expired session. Please sign in again." });
  }
}

// Admin middleware — checks passcode header
function requireAdmin(req, res, next) {
  const passcode = req.headers["x-admin-passcode"] || "";
  if (passcode !== process.env.ADMIN_PASSCODE) {
    return res.status(403).json({ error: "Incorrect passcode." });
  }
  next();
}

// ─── Routes ───────────────────────────────────────────────────────────────

// Health check — Render pings this to confirm the service is up
app.get("/api/health", (_, res) => res.json({ ok: true, ts: Date.now() }));

// POST /api/vote
// Body: { categoryId: string, nomineeId: string }
// Inserts one vote. The unique index rejects a second vote in the same category.
app.post("/api/vote", requireAuth, async (req, res) => {
  const { categoryId, nomineeId } = req.body;
  if (!categoryId || !nomineeId) {
    return res.status(400).json({ error: "categoryId and nomineeId are required." });
  }

  try {
    await db.collection("votes").insertOne({
      voterId:    req.user.uid,
      voterEmail: req.user.email,
      categoryId,
      nomineeId,
      createdAt:  new Date(),
    });
    return res.json({ ok: true });
  } catch (e) {
    // MongoDB duplicate key error code
    if (e.code === 11000) {
      return res.status(409).json({ error: "ALREADY_VOTED", message: "You've already voted in this category." });
    }
    console.error("Vote insert error:", e);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// GET /api/my-votes
// Returns the list of { categoryId, nomineeId } for the signed-in user.
app.get("/api/my-votes", requireAuth, async (req, res) => {
  try {
    const votes = await db.collection("votes")
      .find({ voterId: req.user.uid }, { projection: { categoryId: 1, nomineeId: 1, _id: 0 } })
      .toArray();
    return res.json({ votes });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed to fetch your votes." });
  }
});

// GET /api/results  (admin only)
// Returns vote counts grouped by categoryId + nomineeId.
app.get("/api/results", requireAdmin, async (req, res) => {
  try {
    const tally = await db.collection("votes").aggregate([
      { $group: { _id: { categoryId: "$categoryId", nomineeId: "$nomineeId" }, count: { $sum: 1 } } },
      { $sort: { "_id.categoryId": 1, count: -1 } },
    ]).toArray();

    const totalVotes   = await db.collection("votes").countDocuments();
    const uniqueVoters = (await db.collection("votes").distinct("voterId")).length;

    return res.json({ tally, totalVotes, uniqueVoters });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed to load results." });
  }
});

// GET /api/audit  (admin only)
// Returns the full immutable vote log.
app.get("/api/audit", requireAdmin, async (req, res) => {
  try {
    const votes = await db.collection("votes")
      .find({}, { projection: { _id: 0, voterId: 0 } })
      .sort({ createdAt: -1 })
      .toArray();
    return res.json({ votes });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed to load audit log." });
  }
});

// ─── Start ─────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((e) => {
    console.error("Failed to connect to MongoDB:", e);
    process.exit(1);
  });