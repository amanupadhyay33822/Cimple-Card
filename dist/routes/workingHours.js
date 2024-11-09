import express from 'express';
import { logWorkHours, getWorkHours } from '../controllers/workingHours.js';
import { verifyToken } from '../middleware/auth.js';
const router = express.Router();
// Route to log work hours for a specific date
router.post('/log', verifyToken, logWorkHours);
// Route to get work hours for a specific date
router.get('/get', verifyToken, getWorkHours);
export default router;
