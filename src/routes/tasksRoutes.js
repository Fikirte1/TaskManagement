import express from 'express';
import { createTask, deleteTask, getTask, getTasks, updateTask } from '../controller/tasks/taskController.js';
import authMiddleware from '../middleware/authMiddleware.js';  // Import the middleware

const router = express.Router();

// Apply the authMiddleware to protect the route
router.post('/v1/task/create', authMiddleware, createTask);  // Updated to include authentication
router.get("/tasks", authMiddleware, getTasks);
router.get("/task/:id", getTask);  
router.patch("/task/:id",updateTask);
router.patch("/task/:id",deleteTask);

export default router;
