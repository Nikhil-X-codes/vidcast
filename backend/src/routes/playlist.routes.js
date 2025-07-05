 import {createPlaylist, deletePlaylist, updatePlaylist, addVideoToPlaylist, removeVideoFromPlaylist,getplaylist,getAllPlaylists } from '../Controllers/Playlist.controller.js';
import  Router  from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const playlistRouter = Router();

playlistRouter.post('/create-playlist', verifyJWT, createPlaylist);
playlistRouter.delete('/:playlistId', verifyJWT, deletePlaylist);
playlistRouter.patch('/:playlistId', verifyJWT, updatePlaylist);
playlistRouter.post('/:playlistId/videos/:videoId', verifyJWT, addVideoToPlaylist);
playlistRouter.delete('/:playlistId/videos/:videoId', verifyJWT, removeVideoFromPlaylist);

playlistRouter.get('/user/:userId', verifyJWT, getAllPlaylists);
playlistRouter.get('/:playlistId', verifyJWT, getplaylist);

export default playlistRouter;