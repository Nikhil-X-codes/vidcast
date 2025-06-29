import mongoose, { Schema } from "mongoose";

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
 }

}, { timestamps: true });

export const Playlists= mongoose.model("Playlists",PlaylistsSchema);

