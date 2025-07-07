import asynchandler from "../utils/asynchandler.js";
import { Playlists } from "../models/Playlist.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/apiresponse.js"; 
import mongoose from "mongoose";

const createPlaylist = asynchandler(async (req, res) => {
    const { name, description } = req.body;
    const userId = req.user.id;

    if (!name || !description) {
        throw new ApiError(400, "Name and description are required");
    }

    const playlist = await Playlists.create({
        name,
        description,
        owner: userId,
    });

    res.status(201).json(new ApiResponse(200,"Playlist created successfully",playlist));
});

const deletePlaylist = asynchandler(async (req, res) => {
    const { playlistId } = req.params;
    const userId = req.user.id;

    const playlist = await Playlists.findOneAndDelete({ _id: playlistId, owner: userId });

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    res.status(200).json(new ApiResponse(200,"Playlist deleted successfully",null));
});

const updatePlaylist = asynchandler(async (req, res) => {

    const { playlistId } = req.params;
    const { name, description } = req.body;
    const userId = req.user.id;

    if (!name && !description) {
        throw new ApiError(400, "Name and description are required");
    }

    const playlist = await Playlists.findOne({ _id: playlistId, owner: userId });

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if(name) playlist.name = name;
    if(description) playlist.description = description; 

    await playlist.save();

    res.status(200).json(new ApiResponse(200,"Playlist updated successfully",playlist));
})

const addVideoToPlaylist = asynchandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    const userId = req.user.id;

    const playlist = await Playlists.findOne({ _id: playlistId, owner: userId });

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video already exists in the playlist");
    }

    playlist.videos.push(videoId);
    await playlist.save();

    res.status(200).json(new ApiResponse(200,"Video added to playlist successfully",playlist));
});

const removeVideoFromPlaylist = asynchandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    const userId = req.user.id;

    const playlist = await Playlists.findOne({ 
        _id: playlistId,
        owner: userId
    });

    if (!playlist) {
        throw new ApiError(404, "Playlist not found or you don't have permission");
    }

    if (!playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video does not exist in the playlist");
    }

    playlist.videos = playlist.videos.filter(video => video.toString() !== videoId);
    await playlist.save(); 

    res.status(200).json(new ApiResponse(200,"Video removed from playlist successfully",playlist));
});

const getplaylist = asynchandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }

    const playlist = await Playlists.findById(playlistId).populate({
        path: 'videos',
        select: 'video title description thumbnail', // Include the fields you want from the Video model
    });

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    res.status(200).json(
        new ApiResponse(200, "Playlist retrieved successfully", playlist)
    );
});

const getAllPlaylists = asynchandler(async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const playlists = await Playlists.find({ owner: userId })
    .populate('videos', 'title description thumbnail video')

    if (!playlists.length) {
        throw new ApiError(404, "No playlists found for this user");
    }

    res.status(200).json(
        new ApiResponse(200, "Playlists retrieved successfully", playlists)
    );
});

export { createPlaylist, deletePlaylist, updatePlaylist, addVideoToPlaylist, removeVideoFromPlaylist, getplaylist, getAllPlaylists };