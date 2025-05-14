import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.split(" ")[1];

    if (!accessToken) {
        handleRefresh(req, res, next);
        return;
    }

    try {
        const decoded = jwt.verify(accessToken, JWT_SECRET) as jwt.JwtPayload;
        (req as any).user = decoded;

        next();
    } catch (err) {
        handleRefresh(req, res, next);
    }
};

const handleRefresh = (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies["refresh-token"];
    if (!refreshToken) {
        res.status(401).json({ message: "Unauthorized" })
        return;
    };

    try {
        const decoded = jwt.verify(refreshToken, JWT_SECRET) as jwt.JwtPayload;

        const newAccessToken = jwt.sign(
            {
                _id: decoded._id,
                firstName: decoded.firstName,
                lastName: decoded.lastName,
                username: decoded.username,
                email: decoded.email,
            },
            JWT_SECRET,
            { expiresIn: "30min" }
        );

        req.headers.authorization = `Bearer ${newAccessToken}`;

        res.setHeader("x-access-token", newAccessToken);

        (req as any).user = decoded;

        next();
    } catch (err) {
        res.status(403).json({ message: "Forbidden" });
    }
};
