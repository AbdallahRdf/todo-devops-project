import { Types } from "mongoose";
import { ITask, Task } from "../models/tasks.model";

const getTasks = async (userId: string) => {
    const tasks = await Task.find({ userId });
    return tasks;
}

const createTask = async (task: Omit<ITask, "userId">, userId: Types.ObjectId) => {
    const newTask = await Task.create({...task, userId});
    return newTask;
}

const tasksService = {
    getTasks,
    createTask
}

export default tasksService;