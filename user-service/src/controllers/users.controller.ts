import { NextFunction, Request, Response } from "express";
import userService from "../services/users.service";
import { matchedData, validationResult } from "express-validator";

const signup = async (req: Request, res: Response, next: NextFunction) => {

    const result = validationResult(req);

    if (!result.isEmpty())
        res.status(400).json({ errors: result.array() });

    const { firstName, lastName, username, email, password } = matchedData(req);

    try {
        const accessToken = await userService.signup(res, { firstName, lastName, username, email, password });
        res.status(201).json({ accessToken });
    } catch (error) {
        next(error);
    }
}

const login = async (req: Request, res: Response, next: NextFunction) => {
    const result = validationResult(req);

    if (!result.isEmpty())
        res.status(400).json({ errors: result.array() });

    const { email, password } = matchedData(req);

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

const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = validationResult(req);

        if (!result.isEmpty())
            res.status(400).json({ errors: result.array() });

        const { username } = matchedData(req);

        const user = await userService.get(username);
        res.status(200).json({ user });
    } catch (error) {
        next(error);
    }
};

const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = validationResult(req);

        if (!result.isEmpty())
            res.status(400).json({ errors: result.array() });

        const user = await userService.update(matchedData(req));
        res.status(200).json({ user });
    } catch (error) {
        next(error);
    }
}

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = validationResult(req);

        if (!result.isEmpty())
            res.status(400).json({ errors: result.array() });

        const { username } = matchedData(req);

        await userService.deleteUser(username);

        res.clearCookie("refresh-token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
        });

        res.status(200).json({ message: "User was deleted successfully" })
    } catch (error) {
        next(error);
    }
}

const userController = {
    signup,
    login,
    logout,
    getProfile,
    updateProfile,
    deleteUser
};

export default userController;