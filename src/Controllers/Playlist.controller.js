import asynchandler from "../utils/asynchandler.js";
import { Playlists } from "../models/Playlist.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/apiresponse.js"; 

const createPlaylist = asynchandler(async (req, res) => {
    const { name, description } = req.body;
    const userId = req.user.id;

    if (!name || !description) {
        throw new ApiError(400, "Name and description are required");
    }

    const playlist = await Playlists.create({
        name,
        description,
        user: userId,
    });

    res.status(201).json(new ApiResponse(playlist, "Playlist created successfully"));
});

const deletePlaylist = asynchandler(async (req, res) => {
    const { playlistId } = req.params;
    const userId = req.user.id;

    const playlist = await Playlists.findOneAndDelete({ _id: playlistId, user: userId });

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    res.status(200).json(new ApiResponse(null, "Playlist deleted successfully"));
});

const updatePlaylist = asynchandler(async (req, res) => {

    const { playlistId } = req.params;
    const { name, description } = req.body;
    const userId = req.user.id;

    if (!name || !description) {
        throw new ApiError(400, "Name and description are required");
    }

    const playlist = await Playlists.findOne({ _id: playlistId, user: userId });

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    playlist.name = name;
    playlist.description = description; 

    await playlist.save();

    res.status(200).json(new ApiResponse(playlist, "Playlist updated successfully"));
})

const addVideoToPlaylist = asynchandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    const userId = req.user.id;

    const playlist = await Playlists.findOne({ _id: playlistId, user: userId });

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video already exists in the playlist");
    }

    playlist.videos.push(videoId);
    await playlist.save();

    res.status(200).json(new ApiResponse(playlist, "Video added to playlist successfully"));
});

const removeVideoFromPlaylist = asynchandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    const userId = req.user.id;

    const playlist = await Playlists.findOne({ _id: playlistId, user: userId });

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (!playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video does not exist in the playlist");
    }

    playlist.videos = playlist.videos.filter(video => video !== videoId);
    await playlist.save();

    res.status(200).json(new ApiResponse(playlist, "Video removed from playlist successfully"));
})


export { createPlaylist, deletePlaylist, updatePlaylist, addVideoToPlaylist, removeVideoFromPlaylist };