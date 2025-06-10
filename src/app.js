import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';           //middleware to parse cookies


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.json({
    limit: '1mb'
}));

app.use(express.urlencoded({
    extended: true,
    limit: '1mb'
}));

app.use(express.static('public'));
app.use(cookieParser());

import userRouter from './routes/user.routes.js';

app.use('/api/v1/users', userRouter);

//http://localhost:5000/api/v1/users/register -> will be url for user registration


export default app;


// middleware-> it act as checkpost between request and response.It has access to the req, res, and next objects.