import { IUser, User } from "../models/user.model";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt";
import { Response } from "express";

const signup = async (res: Response, userData: Pick<IUser, "firstName" | "lastName" | "username" | "email" | "password">) => {
    userData.password = await bcrypt.hash(userData.password, 10);
    const user = new User(userData);

    const payload = {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email
    };

    const accessToken = generateToken(payload, '30min');
    const refreshToken = generateToken(payload, '3d');

    user.refreshTokens?.push(refreshToken);

    await user.save();

    res.cookie("refresh-token", refreshToken, {
        httpOnly: true,       // Secure from JS access
        secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000, // 3 day
    });

    return accessToken;
}

const userService = {
    signup
}

export default userService;