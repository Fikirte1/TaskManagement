import asyncHandler from "express-async-handler";
import TaskModel from "../../models/tasks/taskModel.js";

// Create a new task
export const createTask = asyncHandler(async (req, res) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;
    
    // Validate input fields
    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!description || description.trim() === "") {
      return res.status(400).json({ message: "Description is required" });
    }

    // Ensure the user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User is not authenticated" });
    }

    // Create a new task
    const newTask = new TaskModel({
      title,
      description,
      dueDate,
      priority,
      status,
      user: req.user._id, // Associate the task with the user
    });

    // Save the task to the database
    await newTask.save();

    // Send a response with the created task
    res.status(201).json(newTask);
  } catch (error) {
    console.log("Error creating task:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// Get all tasks for the authenticated user
export const getTasks = asyncHandler(async (req, res) => {
  try {
    // Ensure the user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User is not authenticated" });
    }

    const userId = req.user._id;

    // Fetch tasks associated with the user
    const tasks = await TaskModel.find({ user: userId });

    if (tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found" });
    }

    // Send the list of tasks as the response
    res.status(200).json({
      length:tasks.length,
      tasks,
    });
  } catch (error) {
    console.log("Error in getTasks:", error.message);
    res.status(500).json({ message: error.message });
  }
});

export const getTask = asyncHandler(async(req,res)=>{
  try {
    const userId = req.user._id;

    const {id}=req.params;
    if(!id){
      res.status(400).json({message:"please task id"})
    }
const task = await TaskModel.findById(id);

if(!task){
  res.status(400).json({message:"task"})
}
if(!task.user.equals(userId)){
  res.status(400).json({message:"not authorized to view"})
}
res.status(200).json(task)
  } catch (error) {
    
  }
});
export const updateTask = asyncHandler(async(req,res)=>{
  try {
    const userId = req.user._id;
    const { id } =  req.params;
    const {title , descriprion, dueDate,priority,status,completed} = req.body;
    if (!id){
      res.status(400).json({message:"please a task id "});
    }
    if(!task){
    res.status(400).json({message:"task is not found"});
    }
    if(!task.user.equals(userId)){
      res.status(401).json({message:"not authorized"});
    }
     task.title =title||task.title;
     task.descriprion =description||task.descriprion;
     task.dueDate =dueDate||task.dueDate;
     task.priority =priority||task.priority;
     task.status =status||task.status;
     task.completed =completed||task.completed;

     await task.save;
     return res.status(200).json(task);
  } catch (error) {
    
  }
});

export const deleteTask = asyncHandler(async(req,res)=>{
  try {
    const userId = req.user._id;
    const { id } =  req.params;
    task= TaskModel.findById(id);
   
    if (!id){
      res.status(400).json({message:"please a task id "});
    }
    if(!task){
    res.status(400).json({message:"task is not found"});
    }
    if(!task.user.equals(userId)){
      res.status(401).json({message:"not authorized"});
    }
    await TaskModel.findByIdAndDelete(id);
  
    return res.status(200).json({message:"task is deleted"});
 } catch (error) {
  console.log("error delete",error.message);
  res.status(500).json({message : error.message});
   
 }
});