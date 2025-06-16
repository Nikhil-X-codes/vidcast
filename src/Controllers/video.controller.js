import asynchandler from "../utils/asynchandler.js";
import { Video } from "../models/Video.model.js";
import uploadoncloudinary from "../utils/cloudinary.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/apiresponse.js"; 
import { captureOwnerStack } from "react";


const videouploading = asynchandler(async (req, res) => {
    const { title, description } = req.body;

    const videoFile = req.files?.video;
    const thumbnailFile = req.files?.thumbnail;

    if (!videoFile) {
        throw new ApiError(400, "Please upload a video file");
    }

    if (!thumbnailFile) {
        throw new ApiError(400, "Please upload a thumbnail image");
    }

    const videoDetails = await uploadoncloudinary(videoFile.path);
    const thumbnailDetails = await uploadoncloudinary(thumbnailFile.path);

    if (!videoDetails || !thumbnailDetails) {
        throw new ApiError(500, "Upload failed");
    }

    const video = await Video.create({
        title,
        description,
        videoUrl: videoDetails.secure_url,
        thumbnail: thumbnailDetails.secure_url,
    });

    res.status(201).json(new ApiResponse("Video uploaded successfully", video));
});

const videodeleting = asynchandler(async (req, res) => {
    const {videoId} = req.params;

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    await Video.deleteOne({ _id: videoId });
    res.status(200).json(new ApiResponse("Video deleted successfully"));
})

const videoupdating=asynchandler(async (req,res) =>{

    const { videoId } = req.params;
    const { title, description } = req.body;

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (title) video.title = title;
    if (description) video.description = description;
    
    await video.save();
    res.status(200).json(new ApiResponse("Video updated successfully", 
        videoId= video._id,
        title= video.title, 
        description= video.description,
    ));

})

const getAllVideos = asynchandler(async (req, res) => {
    const {page = 1, limit = 10,search, userId } = req.query;

    const filter = {};

  if (search) {
  filter.$or = [
    { title: { $regex: search, $options: "i" } }, 
    { description: { $regex: search, $options: "i" } }
  ];
}

if(userId){
    filter.userId = userId; 
}

const videos= await Video.find(filter)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

    const totalVideos = await Video.countDocuments(filter);
    const totalPages = Math.ceil(totalVideos / limit);

    res.status(200).json(new ApiResponse("Videos fetched successfully", {
        videos,
         pagination: {
                    totalVideos,
                    totalPages: Math.ceil(totalVideos / limit),
                    currentPage: parseInt(page),
                    limit: parseInt(limit),
                },
    }));

})

const getSingleVideo = asynchandler(async (req, res) => {
    const {videoId} = req.params;
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    res.status(200).json(new ApiResponse("Video fetched successfully", video));
})



export {videouploading,videodeleting,videoupdating,getAllVideos,getSingleVideo};