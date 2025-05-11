import { body } from "express-validator";

export const taskSchema = [
    body("title")
        .notEmpty()
        .withMessage("Title is required")
        .isString()
        .withMessage("Title must be a string"),
    body("description")
        .notEmpty()
        .withMessage("Description is required")
        .isString()
        .withMessage("Description must be a string"),
    body("status")
        .notEmpty()
        .withMessage("Status is required")
        .isString()
        .withMessage("Status must be a string")
        .isIn(["pending", "in-progress", "completed", "cancelled"])
        .withMessage("Status must be one of the following: pending, in-progress, completed, cancelled")
        .optional(),
    body("dueDate")
        .notEmpty()
        .withMessage("Due date is required")
        .isDate()
        .withMessage("Due date must be a valid date")
        .optional(),
    body("priority")
        .notEmpty()
        .withMessage("Priority is required")
        .isString()
        .withMessage("Priority must be a string")
        .isIn(["low", "medium", "high"])
        .withMessage("Priority must be one of the following: low, medium, high")
        .optional()
];