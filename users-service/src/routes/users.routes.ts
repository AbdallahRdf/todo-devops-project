import { Router } from "express";
import userController from "../controllers/users.controller";
import { loginSchema, signupSchema, usernameSchema } from "../validation/userSchema";

const usersRouter = Router();

usersRouter.post("/auth/signup", signupSchema, userController.signup);

usersRouter.post("/auth/login", loginSchema, userController.login);

usersRouter.post("/auth/logout", userController.logout);

usersRouter.get("/users/:username", usernameSchema, userController.getProfile);

usersRouter.put("/users/", signupSchema, userController.updateProfile);

usersRouter.delete("/users/:username", usernameSchema, userController.deleteUser);

export default usersRouter;