import express from "express";
import { createAvailabilityHours, updateAvailabilityHours, deleteAvailabilityHours, getAvailabilityHoursById, } from "../controllers/availablityHours.js";
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();
// Create a new availability hours entry
router.post("/create", verifyToken, createAvailabilityHours);
// Get an availability hours entry by ID
router.get("/get/:id", verifyToken, getAvailabilityHoursById);
// Update an availability hours entry by ID
router.put("/update/:id", verifyToken, updateAvailabilityHours);
// Delete an availability hours entry by ID
router.delete("/del/:id", verifyToken, deleteAvailabilityHours);
export default router;
