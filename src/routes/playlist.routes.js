 import {createPlaylist, deletePlaylist, updatePlaylist, addVideoToPlaylist, removeVideoFromPlaylist} from '../Controllers/Playlist.controller.js';
import  Router  from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const playlistRouter = Router();

playlistRouter.post('/create-playlist', verifyJWT, createPlaylist);
playlistRouter.delete('/:playlistId', verifyJWT, deletePlaylist);
playlistRouter.put('/:playlistId', verifyJWT, updatePlaylist);
playlistRouter.post('/:playlistId/videos/:videoId', verifyJWT, addVideoToPlaylist);
playlistRouter.delete('/:playlistId/videos/:videoId', verifyJWT, removeVideoFromPlaylist);

export default playlistRouter;