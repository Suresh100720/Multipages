import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },

    role: { type: String, default: "" },
    status: { type: String, default: "Active" },

    country: { type: String, default: "" },
    state: { type: String, default: "" },

    experience: { type: String, default: "Fresher" },
  },
  { timestamps: true }
);

export default mongoose.model("Candidate", candidateSchema);