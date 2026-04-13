import express from "express";
import Candidate from "../models/Candidate.js";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// 📂 Ensure uploads directory exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// 📦 Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

/* ============================
   DASHBOARD STATE MODEL
============================ */
const dashboardStateSchema = new mongoose.Schema({
  userId: { type: String, default: "admin" },
  columnState: { type: Array, default: [] },
  groupState: { type: Array, default: [] },
});

const DashboardState = mongoose.models.DashboardState || mongoose.model(
  "DashboardState",
  dashboardStateSchema
);

/* ============================
   CANDIDATE CRUD
============================ */

// CREATE
router.post("/", upload.single("resume"), async (req, res) => {
  try {
    const candidateData = { ...req.body };
    
    // If skills is a stringified array, parse it
    if (typeof candidateData.skills === "string") {
      try {
        candidateData.skills = JSON.parse(candidateData.skills);
      } catch (e) {
        // Fallback for comma separated string
        candidateData.skills = candidateData.skills.split(",").map(s => s.trim()).filter(s => s);
      }
    }

    if (req.file) {
      candidateData.resume = req.file.filename;
    }

    const newCandidate = new Candidate(candidateData);
    await newCandidate.save();
    res.status(201).json(newCandidate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET
router.get("/", async (req, res) => {
  try {
    const data = await Candidate.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const updated = await Candidate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Candidate.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// BULK DELETE
router.post("/bulk-delete", async (req, res) => {
  try {
    await Candidate.deleteMany({ _id: { $in: req.body.ids } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ============================
   DASHBOARD STATE APIs
============================ */

// SAVE STATE
router.post("/dashboard-state", async (req, res) => {
  try {
    const { columnState, groupState } = req.body;

    const state = await DashboardState.findOneAndUpdate(
      { userId: "admin" },
      { columnState, groupState },
      { upsert: true, new: true }
    );

    res.json(state);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET STATE
router.get("/dashboard-state", async (req, res) => {
  try {
    const state = await DashboardState.findOne({ userId: "admin" });
    res.json(state || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;