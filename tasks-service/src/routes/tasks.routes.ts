import { Router } from "express";
import tasksController from "../controllers/tasks.controller";
import { taskSchema } from "../validation/shemas";

const tasksRouter = Router();

tasksRouter.get("/", tasksController.getTasks);
tasksRouter.get("/:id", tasksController.getTask);
tasksRouter.post("/", taskSchema, tasksController.createTask);
tasksRouter.put("/:id", taskSchema, tasksController.updateTask);
tasksRouter.delete("/:id", tasksController.deleteTask);

export default tasksRouter;