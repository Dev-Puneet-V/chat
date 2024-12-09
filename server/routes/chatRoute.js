import { Router } from "express";
import {
  getChatInfoController,
  getGroupInfoController,
  userInitialHandshake,
} from "../controllers/chatController.js";
import { isLoggedIn } from "../middlewares/auth.js";

const router = Router();

router.get("/info/group/:groupId", isLoggedIn, getGroupInfoController);
router.get("/info/user/:chatUserId", isLoggedIn, getChatInfoController);
router.post("/initiate/:chatUserId", isLoggedIn, userInitialHandshake);

export default router;
