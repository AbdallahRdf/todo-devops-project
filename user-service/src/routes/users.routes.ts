import { Router } from "express";
import userController from "../controllers/users.controller";

const usersRouter = Router();

usersRouter.post("/", userController.signup);

export default usersRouter;