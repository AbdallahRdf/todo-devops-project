import axios from "axios";
import { Request, Response, NextFunction } from "express";

export const forwardRequest = (targetBaseUrl: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const url = `${targetBaseUrl}${req.originalUrl}`;

      const method = req.method.toLowerCase();

      // Clean headers
      const {
        host,
        'content-length': _contentLength,
        'transfer-encoding': _transferEncoding,
        ...safeHeaders
      } = req.headers;

      const response = await axios({
        method,
        url,
        headers: {
          ...safeHeaders,
          'x-user-id': (req as any).user ? (req as any).user._id : "",
        },
        data: req.body,
        withCredentials: true,
        timeout: 5000, // 5 seconds
      });

      res.cookie("refresh-token", response.data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
      });

      // Forward the response from service to client
      res.status(response.status).json(response.data.accessToken ? { accessToken: response.data.accessToken } : response.data);
    } catch (error: any) {
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        console.error("Error forwarding request:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  };
};
