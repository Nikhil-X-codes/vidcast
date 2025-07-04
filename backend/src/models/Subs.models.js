import mongoose, { Schema } from "mongoose";

const subsSchema = new Schema({
 
    subscriber:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    channel:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

}, { timestamps: true });

export const Subscription = mongoose.model("Subscription", subsSchema);

