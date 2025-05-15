import TimeLog from "../models/TimeLog.js";

// ✅ Create a Time Log
export const createTimeLog = async (req, res) => {
  try {
    const { task, timeSpent, description, endDate } = req.body;

    const newTimeLog = new TimeLog({
      task,
      user: req.user.userId,
      timeSpent,
      description,
      endDate,
    });

    await newTimeLog.save();
    res.status(201).json({ message: "Time log created successfully", newTimeLog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get Time Logs for a Task
export const getTimeLogs = async (req, res) => {
  try {
    const { taskId } = req.params;
    const timeLogs = await TimeLog.find({ task: taskId }).populate("user", "firstName lastName email");
    res.json({ timeLogs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
