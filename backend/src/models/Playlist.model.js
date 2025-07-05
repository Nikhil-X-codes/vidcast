import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const PlaylistsSchema = new Schema({
 
 name:{
    type: String,
    required: true,
 },
 videos: [{
    type: Schema.Types.ObjectId,
    ref: "Video",
 }],
 owner:{
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
 },
 description:{
    type: String,
    required: true,
 }

}, { timestamps: true });

PlaylistsSchema.plugin(mongooseAggregatePaginate);

export const Playlists= mongoose.model("Playlists",PlaylistsSchema);

