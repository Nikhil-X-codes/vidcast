import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const CommentSchema = new Schema({
 
   content:{
    type: String,
    required: true,
   },
   video: {
    type: Schema.Types.ObjectId,
    ref: "Video",
    required: true,
   },
   CommentBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
   },


}, { timestamps: true });

CommentSchema.plugin(mongooseAggregatePaginate);

export const Comments= mongoose.model("Comments",CommentSchema);

