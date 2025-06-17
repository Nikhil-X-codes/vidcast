import asynchandler from "../utils/asynchandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/apiresponse.js"; 
import { Subscription } from "../models/Subs.models.js";

const toggleSubscribe = asynchandler(async (req, res, next) => {
    const { channelId } = req.params;
    const userId = req.user._id;

    if (!channelId) {
        return next(new ApiError("Channel ID is required", 400));
    }

    if (channelId.toString() === userId.toString()) {
        return next(new ApiError("You cannot subscribe to yourself", 400));
    }

    const existingSubscription = await Subscription.findOne({
        subscriber: userId,
        channel: channelId,
    });

    if (existingSubscription) {
        await Subscription.deleteOne({ _id: existingSubscription._id });
        return res.status(200).json(new ApiResponse("Unsubscribed successfully", true));
    } else {
        const newSubscription = new Subscription({
            subscriber: userId,
            channel: channelId,
        });
        await newSubscription.save();
        return res.status(201).json(new ApiResponse("Subscribed successfully", true));
    }
});


const listSubscribedChannels = asynchandler(async (req, res, next) => {
    const userId = req.user._id;

    const subscriptions = await Subscription.find({ subscriber: userId }).populate(
        "channel",
        "avatar description name subscribersCount videosCount"
    );

    const channels = subscriptions.map((sub) => sub.channel);

    return res.status(200).json(new ApiResponse(channels, true));
});


export { toggleSubscribe, listSubscribedChannels };
