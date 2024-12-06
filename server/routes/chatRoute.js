import { Router } from "express";
import { getGroupInfoController } from "../controllers/chatController.js";
import { isLoggedIn } from "../middlewares/auth.js";

const router = Router();

router.get("/info/group/:groupId", isLoggedIn, getGroupInfoController);

export default router;
