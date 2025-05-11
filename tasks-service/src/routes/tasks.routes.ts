import { Router } from "express";
import tasksController from "../controllers/tasks.controller";
import { taskSchema } from "../validation/shemas";

const tasksRouter = Router();

tasksRouter.get("/", tasksController.getTasks);
// tasksRouter.get("/:slug", tasksController.getTask);
tasksRouter.post("/", taskSchema, tasksController.createTask);
// tasksRouter.put("/:slug", tasksController.updateTask);
// tasksRouter.delete("/:slug", tasksController.deleteTask);

export default tasksRouter;