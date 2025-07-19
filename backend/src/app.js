import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';           //middleware to parse cookies


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}))

app.use(express.json({
    limit: '20mb'
}));

app.use(express.urlencoded({
    extended: true,
    limit: '20mb'
}));

app.use(express.static('public'));
app.use(cookieParser());

import userRouter from './routes/user.routes.js';
import videoRouter from './routes/video.routes.js';
import likeRouter from './routes/like.routes.js';
import commentRouter from './routes/comment.routes.js';
import subscriptionRouter from './routes/Subscribe.routes.js';
import playlistRouter from './routes/playlist.routes.js';

app.use('/api/v1/users', userRouter);
app.use('/api/v1/videos', videoRouter);
app.use('/api/v1/likes', likeRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/playlists', playlistRouter);

app.get('/', (req, res) => {
  res.send('Backend is running');
});

export default app;


// middleware-> it act as checkpost between request and response.It has access to the req, res, and next objects.