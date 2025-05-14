import { IUser, User } from "../models/user.model";
import bcrypt from "bcryptjs";
import { Response } from "express";
import { AppError } from "../utils/AppError";
import { generateToken } from "../utils/jwt";

const signup = async (res: Response, userData: Pick<IUser, "firstName" | "lastName" | "username" | "email" | "password">) => {
    // check if email and username are unique
    const existingUser = await User.findOne({ $or: [{ email: userData.email }, { username: userData.username }] });
    if (existingUser)
        throw new AppError("Email or username already exists", 400);

    userData.password = await bcrypt.hash(userData.password, 10);
    const user = new User(userData);
    await user.save();

    const newUser = await User.findOne({ email: userData.email });

    if (!newUser)
        throw new AppError("User not found", 404);

    const payload = {
        _id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        username: newUser.username,
        email: newUser.email,
    };

    const accessToken = generateToken(payload, "30min");
    const refreshToken = generateToken(payload, "3d");

    user.refreshTokens?.push(refreshToken);
    await user.save();

    return { accessToken, refreshToken};
}

const login = async (res: Response, userCredentials: Pick<IUser, "password" | "email">) => {
    const user = await User.findOne({ email: userCredentials.email });

    if (!user)
        throw new AppError("User not found", 404);

    const isMatch = await bcrypt.compare(userCredentials.password, user.password);
    if (!isMatch)
        throw new AppError("Invalid credentials", 400);

    const payload = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
    };

    const accessToken = generateToken(payload, "30min");
    const refreshToken = generateToken(payload, "3d");

    user.refreshTokens?.push(refreshToken);
    await user.save();

    return { accessToken, refreshToken };
}

const logout = async (refreshToken: string) => {
    const user = await User.findOne({ refreshTokens: { $in: [refreshToken] } }, { refreshTokens: true });
    if (!user)
        throw new AppError("User not found", 404);

    user.refreshTokens = user.refreshTokens?.filter((token: string) => token !== refreshToken) as typeof user.refreshTokens;
    await user.save();
}

const get = async (username: string) => {
    const user = await User.findOne({ username }, { firstName: true, lastName: true, username: true, email: true });
    if (!user)
        throw new AppError("User not found", 404);
    return user;
}

const update = async (newUserData: Pick<IUser, "firstName" | "lastName" | "username" | "email" | "password">) => {
    const user = await User.findOne({ email: newUserData.email }, { firstName: true, lastName: true, username: true, email: true });
    if (!user)
        throw new AppError("User not found", 404);

    user.firstName = newUserData.firstName;
    user.lastName = newUserData.lastName;
    user.username = newUserData.username;
    user.password = await bcrypt.hash(newUserData.password, 10);

    await user.save();

    return {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email
    };
}

const deleteUser = async (username: string) => {
    await User.deleteOne({ username });
}

const userService = {
    signup,
    login,
    logout,
    get,
    update,
    deleteUser
}

export default userService;