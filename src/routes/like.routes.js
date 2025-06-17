import { Router } from "express";
import {likeVideo,likecomment,getLikedVideos} from "../Controllers/Like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const likeRouter = Router();


likeRouter.post("/video/:videoId", verifyJWT, likeVideo);
likeRouter.post("/comment/:commentId", verifyJWT, likecomment);
likeRouter.get("/videos", verifyJWT, getLikedVideos);

export default likeRouter;