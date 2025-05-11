import { IUser, User } from "../models/user.model";
import bcrypt from "bcryptjs";
import { Response } from "express";
import { AppError } from "../utils/AppError";
import { handleTokens } from "../utils/tokenHandler";

const signup = async (res: Response, userData: Pick<IUser, "firstName" | "lastName" | "username" | "email" | "password">) => {
    userData.password = await bcrypt.hash(userData.password, 10);
    const user = new User(userData);
    return handleTokens(user, res);
}

const login = async (res: Response, userCredentials: Pick<IUser, "password" | "email">) => {
    const user = await User.findOne({ email: userCredentials.email });

    if (!user)
        throw new AppError("User not found", 404);

    const isMatch = await bcrypt.compare(userCredentials.password, user.password);
    if (!isMatch)
        throw new AppError("Invalid credentials", 400);

    return handleTokens(user, res);
}

const logout = async (refreshToken: string) => {
    const user = await User.findOne({ refreshTokens: { $in: [refreshToken] } }, { refreshTokens: true });
    if (!user)
        throw new AppError("User not found", 404);

    user.refreshTokens = user.refreshTokens?.filter((token: string) => token !== refreshToken) as typeof user.refreshTokens;
    await user.save();
}

const getProfile = async (username: string) => {
    const user = await User.findOne({ username }, {firstName: true, lastName: true, username: true, email: true});
    if(!user) 
        throw new AppError("User not found", 404);
    return user;
}

const userService = {
    signup,
    login,
    logout,
    getProfile
}

export default userService;