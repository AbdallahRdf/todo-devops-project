import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { forwardRequest } from '../utils/forwardRequest';

const router = express.Router();
const USERS_SERVICE_URL = process.env.TASKS_SERVICE_URL!;

// Protect all routes
router.get("/", authMiddleware, forwardRequest(USERS_SERVICE_URL));
router.get("/:id", authMiddleware, forwardRequest(USERS_SERVICE_URL));
router.post("/", authMiddleware, forwardRequest(USERS_SERVICE_URL));
router.put("/:id", authMiddleware, forwardRequest(USERS_SERVICE_URL));
router.delete("/:id", authMiddleware, forwardRequest(USERS_SERVICE_URL));

// TODO: try this later:
// router.all("/*", authMiddleware, forwardRequest(USERS_SERVICE_URL));

export default router;
