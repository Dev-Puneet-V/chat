import { Router } from "express";
import { createUser } from "../controllers/userController.js";
const router = Router();

router.post("/", createUser);
// router.get("/", getUser);

export default router;
