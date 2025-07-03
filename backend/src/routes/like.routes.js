import Router  from "express";
import {likeVideo,getLikedVideos,getLikeStatus} from "../Controllers/Like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const likeRouter = Router();


likeRouter.post("/video/:videoId", verifyJWT, likeVideo);
likeRouter.get("/videos", verifyJWT, getLikedVideos);
likeRouter.post("/status/:videoId", verifyJWT, getLikeStatus);

export default likeRouter;