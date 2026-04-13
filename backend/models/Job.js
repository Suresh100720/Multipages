import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    roleName: { type: String, required: true },
    experience: { type: String, required: true },
    salaryRange: { type: String, required: true },
    country: { type: String, required: true },
    hiringStatus: { type: String, required: true }, // "Actively Hiring" or "Urgently Hiring"
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
