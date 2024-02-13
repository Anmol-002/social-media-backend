import express from "express";
import {
  createChat,
  findChat,
  getAllChats,
  userChats,
} from "../controllers/ChatController.js";
const router = express.Router();

router.post("/", createChat);
router.get("/", getAllChats);
router.get("/:userId", userChats);
router.get("/find/:firstId/:secondId", findChat);

export default router;
