import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error("Error:", err);

    if (err instanceof AppError) {
        res.status(err.statusCode).json({ message: err.message });
        return;
    }

    res.status(500).json({ message: "Internal server error" });
};
