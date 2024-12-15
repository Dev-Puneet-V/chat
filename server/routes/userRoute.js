import { Router } from "express";
import {
  createUser,
  filterByUserName,
  getUserHistory,
} from "../controllers/userController.js";
import { isLoggedIn } from "../middlewares/auth.js";
const router = Router();

router.post("/", createUser);
router.get("/filter", isLoggedIn, filterByUserName);
router.get("/history", isLoggedIn, getUserHistory);
export default router;
