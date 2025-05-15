import mongoose from "mongoose";

const timeLogSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    timeSpent: {
      type: Number, // Time in minutes
      required: true,
      min: [0, "Time spent cannot be negative"], // Prevent negative values
    },
    description: {
      type: String, // Optional: A description of what was done during the time spent
    },
    dateLogged: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date, // Optional: To mark when the work on the task was finished
    },
  },
  { timestamps: true }
);

const TimeLog = mongoose.model("TimeLog", timeLogSchema);

export default TimeLog;
