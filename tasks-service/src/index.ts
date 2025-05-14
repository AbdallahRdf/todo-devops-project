import express from 'express';
import mongoose from "mongoose";
import tasksRouter from './routes/tasks.routes';
import morgan from "morgan";
import { errorHandler } from './middlewares/errorHandler';

const PORT = process.env.PORT || 3002;
const URI = process.env.MONGODB_CONNECTION_STRING;

if (!URI)
    throw new Error("MONGODB_CONNECTION_STRING environment variable is not defined");

try {
    mongoose.connect(URI);
    console.log("Tasks service is connected to the database");
} catch (error) {
    console.log("MongoDB connection failed in tasks service.");
    console.error(error);  
}

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api/tasks', tasksRouter);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Tasks service is running on port ${PORT}`));