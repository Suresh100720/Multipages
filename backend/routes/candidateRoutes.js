import express from "express";
import Candidate from "../models/Candidate.js";
import mongoose from "mongoose";

const router = express.Router();

/* ============================
   DASHBOARD STATE MODEL
============================ */
const dashboardStateSchema = new mongoose.Schema({
  userId: { type: String, default: "admin" },
  columnState: { type: Array, default: [] },
  groupState: { type: Array, default: [] },
});

const DashboardState = mongoose.model(
  "DashboardState",
  dashboardStateSchema
);

/* ============================
   CANDIDATE CRUD
============================ */

// CREATE
router.post("/", async (req, res) => {
  try {
    const newCandidate = new Candidate(req.body);
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