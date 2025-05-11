import { NextFunction, Request, Response } from "express";
import tasksService from "../services/tasks.service";
import { getIdFromToken } from "../utils/jwt";
import { matchedData, validationResult } from "express-validator";
import { ITask } from "../models/tasks.model";

const getTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = getIdFromToken(req);

        const tasks = await tasksService.getTasks(userId);
        res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
}

const createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = validationResult(req);

        if (!result.isEmpty())
            res.status(400).json({ errors: result.array() });

        const taskData = {...matchedData(req)} as Omit<ITask, "userId">;

        const userId = getIdFromToken(req);

        const task = await tasksService.createTask(taskData, userId);
        res.status(201).json(task);
    } catch (error) {
        next(error);    
    }
}

const getTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = getIdFromToken(req);

        const taskId = req.params.id;
        const task = await tasksService.getTask(taskId, userId);
        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
}

const updateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = getIdFromToken(req);

        const taskId = req.params.id;
        const taskData = {...matchedData(req)} as Omit<ITask, "userId">;

        const task = await tasksService.updateTask(taskId, taskData, userId);
        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
}

const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = getIdFromToken(req);

        const taskId = req.params.id;
        await tasksService.deleteTask(taskId, userId);
        res.status(204).json();
    } catch (error) {
        next(error);
    }
}

const tasksController = {
    getTasks,
    createTask,
    getTask,
    updateTask,
    deleteTask
}

export default tasksController;