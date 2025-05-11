import { NextFunction, Request, Response } from "express";
import tasksService from "../services/tasks.service";
import { decodeJWT } from "../utils/jwt";
import { matchedData, validationResult } from "express-validator";
import { Types } from "mongoose";
import { ITask } from "../models/tasks.model";

const getTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = (req.headers["authorization"] as string).split(" ")[1];
        const payload = decodeJWT(accessToken);

        const tasks = await tasksService.getTasks(payload?._id);
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

        const accessToken = (req.headers["authorization"] as string).split(" ")[1];
        const payload = decodeJWT(accessToken);
        console.log(payload);

        const task = await tasksService.createTask(taskData, payload?._id as Types.ObjectId);
        res.status(201).json(task);
    } catch (error) {
        next(error);    
    }
}

const getTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = (req.headers["authorization"] as string).split(" ")[1];
        const payload = decodeJWT(accessToken);

        const taskId = req.params.id;
        const task = await tasksService.getTask(taskId, payload?._id as Types.ObjectId);
        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
}

const updateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = (req.headers["authorization"] as string).split(" ")[1];
        const payload = decodeJWT(accessToken);

        const taskId = req.params.id;
        const taskData = {...matchedData(req)} as Omit<ITask, "userId">;

        const task = await tasksService.updateTask(taskId, taskData, payload?._id as Types.ObjectId);
        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
}

const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = (req.headers["authorization"] as string).split(" ")[1];
        const payload = decodeJWT(accessToken);

        const taskId = req.params.id;
        await tasksService.deleteTask(taskId, payload?._id as Types.ObjectId);
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