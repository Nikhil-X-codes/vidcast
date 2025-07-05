import asynchandler from "../utils/asynchandler.js";
import {Comments} from "../models/Comments.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/apiresponse.js";


const addComment = asynchandler(async (req, res) => {
    const { videoId } = req.params;
    const { commentText } = req.body;

    if (!commentText) {
        throw new ApiError(400, "Comment text is required");
    }

    const comment = await Comments.create({
        video: videoId,
        CommentBy: req.user._id,
        content: commentText
    })

    res.status(201).json(new ApiResponse(200,"Comment added successfully", comment));
})

const deleteComment = asynchandler(async (req, res) => {
    const { commentId } = req.params;

    const comment = await Comments.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }   

    await Comments.deleteOne({ _id: commentId });

    res.status(200).json(new ApiResponse(200,"Comment deleted successfully"));
})

const updatingComment = asynchandler(async (req, res) => {
    const { commentId } = req.params;
    const { commentText } = req.body;

    if (!commentText) {
        throw new ApiError(400, "Comment text is required");
    }

    const comment = await Comments.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    comment.content = commentText;
    await comment.save();

    res.status(200).json(new ApiResponse(200,"Comment updated successfully", comment));
})

const getComment = asynchandler(async (req, res) => {
    const { videoId } = req.params; 
    const comments = await Comments.find({ video: videoId })
        .populate("CommentBy", "username avatar")
        .sort({ createdAt: -1 });
    if (!comments || comments.length === 0) {
        throw new ApiError(404, "No comments found for this video");    
    }
    res.status(200).json(new ApiResponse(200,"Comments fetched successfully",comments));
})

export {addComment, deleteComment,updatingComment,getComment}