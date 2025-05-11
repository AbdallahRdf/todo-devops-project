import { NextFunction, Request, Response } from "express";
import tasksService from "../services/tasks.service";
import { decodeJWT } from "../utils/jwt";

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

const tasksController = {
    getTasks
}

export default tasksController;