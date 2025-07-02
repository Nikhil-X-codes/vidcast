import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const LikeSchema = new Schema({
 
   comment:{
    type: Schema.Types.ObjectId,
    ref: "Comment",
   },
   video: {
    type: Schema.Types.ObjectId,
    ref: "Video",
   },
   likedby:{
    type: Schema.Types.ObjectId,
    ref: "User",
   },
   likecount:{
      type: Number,
      default: 0,
   }

}, { timestamps: true });

LikeSchema.plugin(mongooseAggregatePaginate);

export const Likes = mongoose.model("Likes", LikeSchema);

