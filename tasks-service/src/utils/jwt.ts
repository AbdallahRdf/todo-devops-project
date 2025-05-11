import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

/**
 * Decodes and verifies the JWT token.
 * @param token The JWT token to be decoded and verified.
 * @returns The decoded payload if the token is valid, otherwise null.
 */
export const decodeJWT = (token: string): JwtPayload | null => {
    try {
        // Verify and decode the token
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded as JwtPayload;
    } catch (error) {
        // Handle token verification failure (e.g., expired or invalid token)
        console.error('Token verification failed:', error);
        return null;
    }
};
