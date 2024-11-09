import express from 'express';
import { calculateEquity } from '../controllers/equity.js';
const router = express.Router();
router.get("/calc", calculateEquity);
export default router;
