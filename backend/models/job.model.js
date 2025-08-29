import mongoose from "mongoose";

const JobSchema = mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["applied", "interview", "offer", "rejected"],
      default: "applied",
    },
    jobType: {
      type: String,
      enum: ["internship", "full-time", "part-time", "contract"],
      default: "full-time",
    },
    description: {
      type: String,
      maxlength: 500,
      trim: true,
    },
    location: {
      type: String,
      default: "remote",
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const JobModel = mongoose.model("Job", JobSchema);

export default JobModel;
