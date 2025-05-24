import express, { Request } from 'express';
import usersRoutes from './routes/users.routes';
import tasksRoutes from './routes/tasks.routes';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// app.use(morgan('dev', {stream: accessLogStream}));
//* Use morgan in JSON format
morgan.token('body', (req: Request) => JSON.stringify(req.body));

app.use(
  morgan((tokens, req, res) => {
    return JSON.stringify({
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: Number(tokens.status(req, res)),
      content_length: tokens.res(req, res, 'content-length'),
      response_time: `${tokens['response-time'](req, res)} ms`,
      date: tokens.date(req, res, 'iso'),
    });
  }, { stream: accessLogStream })
);


// Mount the services
app.use("/api/tasks", tasksRoutes);
app.use("/api", usersRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
});
