import express from 'express';
import usersRoutes from './routes/users.routes';
import tasksRoutes from './routes/tasks.routes';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Mount the services
app.use("/api/tasks", tasksRoutes);
app.use("/api", usersRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
});
