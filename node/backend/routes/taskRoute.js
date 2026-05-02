import express from "express";
import { addTask, getTasks, updateTask, deleteTask } from "../controllers/taskController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const taskRouter = express.Router();

// protect this route using the authMiddleware
taskRouter.post("/add", authMiddleware, addTask);
taskRouter.get("/get", authMiddleware, getTasks);
taskRouter.put("/update/:id", authMiddleware, updateTask);
taskRouter.delete("/delete/:id", authMiddleware, deleteTask);

export default taskRouter;
