import { Router } from "express";
import { createUser, filterByUserName } from "../controllers/userController.js";
import { isLoggedIn } from "../middlewares/auth.js";
const router = Router();

router.post("/", createUser);
router.get("/filter", isLoggedIn, filterByUserName);

export default router;
