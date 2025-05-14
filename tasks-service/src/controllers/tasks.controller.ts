import { NextFunction, Request, Response } from "express";
import tasksService from "../services/tasks.service";
import { matchedData, validationResult } from "express-validator";
import { ITask } from "../models/tasks.model";

const getTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tasks = await tasksService.getTasks(req.headers['x-user-id'] as string);
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

        const task = await tasksService.createTask(taskData, req.headers['x-user-id'] as string);
        res.status(201).json(task);
    } catch (error) {
        next(error);    
    }
}

const getTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const taskId = req.params.id;
        const task = await tasksService.getTask(taskId, req.headers['x-user-id'] as string);
        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
}

const updateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const taskId = req.params.id;
        const taskData = {...matchedData(req)} as Omit<ITask, "userId">;

        const task = await tasksService.updateTask(taskId, taskData, req.headers['x-user-id'] as string);
        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
}

const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const taskId = req.params.id;
        await tasksService.deleteTask(taskId, req.headers['x-user-id'] as string);
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