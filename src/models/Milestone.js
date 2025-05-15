import mongoose from "mongoose";

const milestoneSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    milestoneName: {
      type: String,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    completionDate: {
      type: Date, // Optional: marks the date when the milestone was completed
    },
    isAchieved: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String, // Optional: Low, Medium, High
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    comments: {
      type: String, // Optional: Detailed notes for the milestone
    },
  },
  { timestamps: true }
);

const Milestone = mongoose.model("Milestone", milestoneSchema);

export default Milestone;
