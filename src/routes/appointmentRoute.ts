import express from 'express'
import { createAppointment, deleteAppointment, getAllAppointments, updateAppointment } from '../controllers/appointment.js';
import { verifyToken } from '../middleware/auth.js';
const router = express.Router();

router.post("/create",createAppointment)
router.get("/get",verifyToken,getAllAppointments)
router.put("/update/:id",verifyToken,updateAppointment)
router.delete("/del/:id",verifyToken,deleteAppointment)


export default router;