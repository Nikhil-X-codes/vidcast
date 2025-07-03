import asynchandler from "../utils/asynchandler.js";
import { Likes } from "../models/Likes.model.js";
import { Video } from "../models/Video.model.js";
import {Comments} from "../models/Comments.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/apiresponse.js"; 
import mongoose from "mongoose";

const likeVideo = asynchandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID format");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const existingLike = await Likes.findOne({ likedby: userId, video: videoId });

  if (existingLike) {
    // Remove like
    await Likes.findByIdAndDelete(existingLike._id);
    const newCount = await Likes.countDocuments({ video: videoId });
    await Video.findByIdAndUpdate(videoId, { likecount: newCount });

    return res.status(200).json(
      new ApiResponse(200, "Like removed (disliked)", {
        likecount: newCount,
        liked: false,
      }, true)
    );
  }

  // Add new like
  await Likes.create({ likedby: userId, video: videoId });
  const newCount = await Likes.countDocuments({ video: videoId });
  await Video.findByIdAndUpdate(videoId, { likecount: newCount });

  return res.status(201).json(
    new ApiResponse(200, "Video liked successfully", {
      likecount: newCount,
      liked: true,
    }, true)
  );
});

const likecomment = asynchandler(async (req, res) => {         
  
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comments.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    const existingLike = await Likes.findOne({ comment: commentId, likedby: userId });
    if (existingLike) {
        await Likes.findByIdAndDelete(existingLike._id);

        const newCount = await Likes.countDocuments({ comment: commentId });
        await Comments.findByIdAndUpdate(commentId, { likecount: newCount });

           return res.status(200).json(
            new ApiResponse("Like on comment removed (disliked)", {
              likecount: newCount,
            })
        );
    }

    const like = await Likes.create({
        comment: commentId,
        likedby: userId
    });

    const newCount = await Likes.countDocuments({ comment: commentId });
    await Comments.findByIdAndUpdate(commentId, { likecount: newCount });
    
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

const getLikeStatus = asynchandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID format");
  }

  const existingLike = await Likes.findOne({ likedby: userId, video: videoId });

  return res.status(200).json(
    new ApiResponse(200, "Like status fetched", {
      liked: !!existingLike,
    }, true)
  );
});

export {likeVideo,likecomment,getLikedVideos,getLikeStatus};