import { overrideScores } from "../controllers/admin.js";
import { isAdmin } from "../middleware/auth.js";
import express from 'express';
const router = express.Router();
router.patch("/metrics/adjust", isAdmin, overrideScores);
export default router;
