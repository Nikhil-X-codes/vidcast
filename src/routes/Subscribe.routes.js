import {toggleSubscribe, listSubscribedChannels} from "../Controllers/Subscription.controller.js";
import  Router  from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const subscribeRouter = Router();

subscribeRouter.post("/toggle/:channelId", verifyJWT, toggleSubscribe);
subscribeRouter.get("/channels", verifyJWT, listSubscribedChannels);

export default subscribeRouter;