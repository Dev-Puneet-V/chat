import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.js";
import { createGroupController } from "../controllers/groupController.js";
const router = Router();

router.post("/", isLoggedIn, createGroupController);
export default router;
