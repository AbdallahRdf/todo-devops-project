import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { forwardRequest } from '../utils/forwardRequest';

const router = express.Router();
const USERS_SERVICE_URL = process.env.USERS_SERVICE_URL!;

router.post("/auth/signup", forwardRequest(USERS_SERVICE_URL));
router.post("/auth/login", forwardRequest(USERS_SERVICE_URL));

// Protect all routes after this
router.post("/auth/logout", authMiddleware, forwardRequest(USERS_SERVICE_URL));
router.get("/users/:username", authMiddleware, forwardRequest(USERS_SERVICE_URL));
router.put("/users", authMiddleware, forwardRequest(USERS_SERVICE_URL));
router.delete("/users/:username", authMiddleware, forwardRequest(USERS_SERVICE_URL));

export default router;
