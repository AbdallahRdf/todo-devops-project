import { Router } from "express";
import userController from "../controllers/users.controller";

const usersRouter = Router();

usersRouter.post("/auth/signup", userController.signup);

usersRouter.post("/auth/login", userController.login);

usersRouter.post("/auth/logout", userController.logout);

usersRouter.get("/users/:username", userController.getProfile);

usersRouter.put("/users/", userController.updateProfile);

export default usersRouter;