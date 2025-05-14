import express from 'express';
import mongoose from "mongoose";
import usersRouter from './routes/users.routes';
import cookieParser from "cookie-parser";
import { errorHandler } from './middlewares/errorHandler';
import morgan from "morgan";

const PORT = process.env.PORT || 3001;
const URI = process.env.MONGODB_CONNECTION_STRING;

if (!URI)
    throw new Error("MONGODB_CONNECTION_STRING environment variable is not defined");

try {
    mongoose.connect(URI);
    console.log("Users service is connected to the database");
} catch (error) {
    console.log("MongoDB connection failed in users service.");
    console.error(error);
}

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api', usersRouter);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Users service is running on port ${PORT}`));