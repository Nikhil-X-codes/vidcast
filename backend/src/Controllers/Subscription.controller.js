import asynchandler from "../utils/asynchandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/apiresponse.js"; 
import { Subscription } from "../models/Subs.models.js";

const toggleSubscribe = asynchandler(async (req, res) => {
    const { channelId } = req.params;
    const userId = req.user._id;

    if (!channelId) {
       throw new ApiError(400,"Channel ID is required");
    }

    if (channelId.toString() === userId.toString()) {
        throw new ApiError(400,"You cannot subscribe to your own channel");
    }

    const existingSubscription = await Subscription.findOne({
        subscriber: userId,
        channel: channelId,
    });

    if (existingSubscription) {
        await Subscription.deleteOne({ _id: existingSubscription._id });
        return res.status(200).json(new ApiResponse(200,"Unsubscribed successfully", true));
    } else {
        const newSubscription = new Subscription({
            subscriber: userId,
            channel: channelId,
        });
        await newSubscription.save();
        return res.status(201).json(new ApiResponse(200,"Subscribed successfully", true));
    }
});

const listSubscribedChannels = asynchandler(async (req, res) => {
    const userId = req.user._id;

    const subscriptions = await Subscription.find({ subscriber: userId }).populate(
        "channel",
        "avatar username"
    );

    const channels = subscriptions.map((sub) => sub.channel);

    return res.status(200).json(new ApiResponse(
        200,
        "Subscribed channels retrieved successfully",
        {
            count: channels.length,
            channels: channels,
        }, 
        true
    ));
});

const listSubscribersOfChannel = asynchandler(async (req, res, next) => {
  const { channelId } = req.params;

  if (!channelId) {
    return next(new ApiError("Channel ID is required", 400));
  }

  const subscribers = await Subscription.find({ channel: channelId }).populate(
    "subscriber",
    "_id avatar username" // <-- Include _id here
  );

  const subscriberList = subscribers.map(sub => sub.subscriber);

  return res.status(200).json(new ApiResponse(
    200,
    "Subscribers retrieved successfully",
    {
      count: subscriberList.length,
      subscribers: subscriberList
    },
    true
  ));
});



export { toggleSubscribe, listSubscribedChannels, listSubscribersOfChannel };
