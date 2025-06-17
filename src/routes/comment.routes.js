import { Router } from "express";
import {addComment, deleteComment,updatingComment} from "../Controllers/Comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const commentRouter = Router();

commentRouter.post("/add/:videoId", verifyJWT, addComment);
commentRouter.delete("/delete/:commentId", verifyJWT, deleteComment);
commentRouter.patch("/update/:commentId", verifyJWT, updatingComment);

export default commentRouter;