import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.js";
import {
  createGroupController,
  filterByNames,
} from "../controllers/groupController.js";
const router = Router();

router.post("/", isLoggedIn, createGroupController);
router.get("/filter", isLoggedIn, filterByNames);

export default router;
