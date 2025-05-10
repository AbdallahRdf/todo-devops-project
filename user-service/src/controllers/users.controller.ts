import { Request, Response } from "express";
import userService from "../services/users.service";

const signup =  async (req: Request, res: Response) => {
    const { firstName, lastName, username, email, password } = req.body;

    if (!firstName || !lastName || !username || !password || !email) {
        res.status(400).json({ message: "All fields are required" });
    }

    try {
        const accessToken = await userService.signup(res, { firstName, lastName, username, email, password });
        res.status(201).json({ accessToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const userController = {
    signup
};

export default userController;