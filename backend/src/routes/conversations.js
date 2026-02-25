import { Router } from "express";
import { authenticateJWT } from "../middleware/authenticateJWT.js";
import {
  listConversations,
  getMessages,
  sendMessage,
  createConversation,
} from "../controllers/conversationController.js";

const router = Router();

router.get("/", authenticateJWT, listConversations);
router.post("/", authenticateJWT, createConversation);
router.get("/:id/messages", authenticateJWT, getMessages);
router.post("/:id/messages", authenticateJWT, sendMessage);

export default router;
