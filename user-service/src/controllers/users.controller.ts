import { NextFunction, Request, Response } from "express";
import userService from "../services/users.service";

const signup = async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, username, email, password } = req.body;

    if (!firstName || !lastName || !username || !password || !email) {
        res.status(400).json({ message: "All fields are required" });
    }

    try {
        const accessToken = await userService.signup(res, { firstName, lastName, username, email, password });
        res.status(201).json({ accessToken });
    } catch (error) {
        next(error);
    }
}

const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!password || !email) {
        res.status(400).json({ message: "All fields are required" });
    }

    try {
        const accessToken = await userService.login(res, { email, password });
        res.status(200).json({ accessToken });
    } catch (error) {
        next(error);
    }
}

const userController = {
    signup,
    login
};

export default userController;