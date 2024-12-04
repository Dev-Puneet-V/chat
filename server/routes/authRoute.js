import { Router } from "express";
import {
  loginController,
  logoutController,
} from "../controllers/authController.js";
const router = Router();

router.get("/logout", logoutController);
router.post("/login", loginController);

export default router;
