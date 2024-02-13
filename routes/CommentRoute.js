import express from "express";
import { commentGet, commentPost } from "../controllers/CommentController.js";

const router = express.Router();

router.post("/", commentPost);
router.get("/",commentGet);
export default router;
