import { toggleSubscribe, listSubscribedChannels, listSubscribersOfChannel} from "../Controllers/Subscription.controller.js";
import  Router  from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const subscribeRouter = Router();

subscribeRouter.post("/toggle/:channelId", verifyJWT, toggleSubscribe);
subscribeRouter.get("/channels", verifyJWT, listSubscribedChannels);
subscribeRouter.get("/subscribers/:channelId", verifyJWT, listSubscribersOfChannel);

export default subscribeRouter;