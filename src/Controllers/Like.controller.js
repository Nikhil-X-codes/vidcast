import asynchandler from "../utils/asynchandler.js";
import { Likes } from "../models/Likes.model.js";
import { Video } from "../models/Video.model.js";
import {Comments} from "../models/Comments.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/apiresponse.js"; 
import mongoose from "mongoose";


const likeVideo = asynchandler(async (req, res, next) => {
    const { videoId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID format");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const existingLike = await Likes.findOneAndDelete({ 
        likedby: userId,
        video: videoId
    });

    if (existingLike) {
        return res.status(200).json(
            new ApiResponse("Like removed (disliked)", existingLike)
        );
    }

    const like = await Likes.create({
        likedby: userId,
        video: videoId
    });

    return res.status(201).json(
        new ApiResponse("Video liked successfully", like)
    );
});


const likecomment = asynchandler(async (req, res, next) => {         
  
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comments.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    const existingLike = await Likes.findOne({ comment: commentId, likedby: userId });
    if (existingLike) {
        return res.status(200).json(new ApiResponse("Comment already liked", existingLike));
    }

    const like = await Likes.create({
        comment: commentId,
        likedby: userId
    });

    res.status(201).json(new ApiResponse("Comment liked successfully", like));
})


const getLikedVideos = asynchandler(async (req, res) => {
  const userId = req.user._id;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const aggregate = Likes.aggregate([
    {
      $match: {
        likedby: new mongoose.Types.ObjectId(userId),
        video: { $ne: null },
      },
    },
    {
      $lookup: {
        from: "videos", 
        localField: "video",
        foreignField: "_id",
        as: "videoDetails",
      },
    },
    { $unwind: "$videoDetails" },
    {
      $replaceRoot: { newRoot: "$videoDetails" },
    },
  ]);

  const options = {
    page,
    limit,
  };

  const likedVideos = await Likes.aggregatePaginate(aggregate, options);

 res.status(200).json(
    new ApiResponse("Liked videos retrieved successfully", likedVideos)
  );
});


export {likeVideo,likecomment,getLikedVideos};