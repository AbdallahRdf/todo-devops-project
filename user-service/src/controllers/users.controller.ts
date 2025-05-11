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

const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.cookies["refresh-token"];
        if (!refreshToken) {
            res.status(400).json({ message: "No refresh token provided" });
        }

        await userService.logout(refreshToken);

        res.clearCookie("refresh-token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
        });

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        next(error);
    }
};

const userController = {
    signup,
    login,
    logout
};

export default userController;