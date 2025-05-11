import { Response } from "express";
import { IUser } from "../models/user.model";
import { generateToken } from "./jwt";

export const handleTokens = async (user: IUser, res: Response) => {
    const payload = {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
    };

    const accessToken = generateToken(payload, "30min");
    const refreshToken = generateToken(payload, "3d");

    user.refreshTokens?.push(refreshToken);
    await user.save();

    res.cookie("refresh-token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
    });

    return accessToken;
};
