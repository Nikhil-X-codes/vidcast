import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({

  video:{
    type: String,
    required: true,
  },
  thumbnail:{
    type: String,
    required: true,
  },
  owner:{
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title:{
    type: String,
    required: true,
    trim: true,
    index: true
  },
    description:{
        type: String,
        required: true,
    },
    views:{
        type:Number,
        default: 0,
    },


},{timestamps:true})

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);