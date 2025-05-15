import Task from "../models/task.js";
import Notification from "../models/Notification.js";
import { io } from "../../server.js"; // Importing io from server.js
// import //redisClient from "../config///redisClient.js"; // ✅ Import Redis client

// ✅ Get All Tasks with Redis Caching
export const getTasks = async (req, res) => {
  try {
    // Check if tasks are cached in Redis
    //redisClient.get("tasks", async (err, cachedTasks) => {
      // if (cachedTasks) {
      //   console.log("✅ Serving tasks from cache");
      //   return res.json(JSON.parse(cachedTasks)); // Return cached data
      // }

      // If not cached, fetch from database
      const tasks = await Task.find().populate("assignedTo", "firstName lastName email");

      // Store fetched tasks in Redis with expiry time (1 hour)
      //redisClient.setex("tasks", 3600, JSON.stringify(tasks));

      console.log("✅ Serving tasks from database");
      res.json(tasks);
    // });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Create a Task (Also Clear Cache)
export const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate } = req.body;
    const task = new Task({
      title,
      description,
      assignedTo,
      dueDate,
      createdBy: req.user.userId, // Extracted from JWT
    });

    await task.save();

    // ✅ Clear cache after creating a task
    //redisClient.del("tasks");

    // Emit notification when a new task is created
    const notificationData = {
      user: assignedTo, // The user who is assigned the task
      sender: req.user.userId, // Sender is the current authenticated user
      message: `You have been assigned a new task: ${task.title}`,
      type: "task", // Type of notification
      relatedId: task._id, // Related task ID
    };

    // Emit the notification to all connected clients
    io.emit("receiveNotification", notificationData);

    // Save notification in the database
    const newNotification = new Notification(notificationData);
    await newNotification.save();

    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update a Task (Also Clear Cache)
export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, status, assignedTo, dueDate } = req.body;
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    // Update task fields if provided
    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (assignedTo) task.assignedTo = assignedTo;
    if (dueDate) task.dueDate = dueDate;

    await task.save();

    // ✅ Clear cache after updating a task
    //redisClient.del("tasks");

    // Emit notification when task is updated
    const notificationData = {
      user: assignedTo, // The user who is assigned the task (if updated)
      sender: req.user.userId, // Sender is the current authenticated user
      message: `The task "${task.title}" has been updated.`,
      type: "task-update", // Type of notification
      relatedId: task._id, // Related task ID
    };

    // Emit the notification to all connected clients
    io.emit("receiveNotification", notificationData);

    // Save notification in the database
    const newNotification = new Notification(notificationData);
    await newNotification.save();

    res.json({ message: "Task updated successfully", task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete a Task (Also Clear Cache)
export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    await Task.findByIdAndDelete(taskId);
    
    // ✅ Clear cache after deleting a task
    //redisClient.del("tasks");

    // Emit notification when a task is deleted
    const notificationData = {
      user: req.user.userId, // The user deleting the task
      sender: req.user.userId,
      message: `The task with ID ${taskId} has been deleted.`,
      type: "task-delete", // Type of notification
      relatedId: taskId, // Related task ID
    };

    // Emit the notification to all connected clients
    io.emit("receiveNotification", notificationData);

    // Save notification in the database
    const newNotification = new Notification(notificationData);
    await newNotification.save();

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getAllTask = async (req, res) => {
  try{
      const tasks = await Task.find();
      console.log("serving all tasks from database");
      res.json(tasks);
  }
  catch(err){
      res.status(500).json({ error: error.message });
  }



};