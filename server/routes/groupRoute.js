import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.js";
import {
  createGroupController,
  filterByNames,
  joinGroupController,
} from "../controllers/groupController.js";
const router = Router();

router.post("/", isLoggedIn, createGroupController);
router.get("/filter", isLoggedIn, filterByNames);
router.post("/join/:groupId", isLoggedIn, joinGroupController);

export default router;
