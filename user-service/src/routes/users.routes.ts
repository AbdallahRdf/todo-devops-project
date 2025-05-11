import { Router } from "express";
import userController from "../controllers/users.controller";

const usersRouter = Router();

usersRouter.post("/auth/signup", userController.signup);

usersRouter.post("/auth/login", userController.login);

export default usersRouter;