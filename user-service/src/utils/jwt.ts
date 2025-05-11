import jwt, { Secret } from "jsonwebtoken";

const JWT_SECRET: Secret = process.env.JWT_SECRET as Secret;

export const generateToken = (payload: object, expiresIn = '1d') => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
};
