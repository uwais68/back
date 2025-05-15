import Milestone from "../models/Milestone.js";

// ✅ Create a Milestone
export const createMilestone = async (req, res) => {
  try {
    const { task, milestoneName, dueDate, priority, comments } = req.body;

    const newMilestone = new Milestone({
      task,
      milestoneName,
      dueDate,
      priority,
      comments,
    });

    await newMilestone.save();
    res.status(201).json({ message: "Milestone created successfully", newMilestone });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get Milestones for a Task
export const getMilestones = async (req, res) => {
  try {
    const { taskId } = req.params;
    const milestones = await Milestone.find({ task: taskId }).sort({ dueDate: 1 });
    res.json({ milestones });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Mark a Milestone as Achieved
export const markMilestoneAchieved = async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const milestone = await Milestone.findById(milestoneId);
    
    if (!milestone) return res.status(404).json({ error: "Milestone not found" });

    milestone.isAchieved = true;
    milestone.completionDate = new Date(); // Set completion date when achieved
    await milestone.save();
    res.json({ message: "Milestone marked as achieved", milestone });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
