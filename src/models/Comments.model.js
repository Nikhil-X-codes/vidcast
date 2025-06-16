import mongoose, { Schema } from "mongoose";

const CommentSchema = new Schema({
 
   content:{
    type: String,
   },
   video: {
    type: Schema.Types.ObjectId,
    ref: "Video",
    required: true,
   },
   owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
   },

}, { timestamps: true });

export const Comments= mongoose.model("Comments",CommentSchema);

