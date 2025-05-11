import { Task } from "../models/tasks.model";

const getTasks = async (userId: string) => {
    const tasks = await Task.find({ userId });
    return tasks;
}

const tasksService = {
    getTasks
}

export default tasksService;