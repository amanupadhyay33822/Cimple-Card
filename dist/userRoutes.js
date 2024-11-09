import { Router } from "express";
import { register } from "./controllers/auth.js";
const router = Router();
router.post("/signup", register);
export default router;
