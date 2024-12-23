import express from "express";
import { createCard, getAllCards, getCardById, updateCard, deleteCard, getServicesByCardId, getCardDetails, } from "../controllers/card.js";
import { verifyToken } from "../middleware/auth.js";
import multer from "multer";
const upload = multer({ dest: "uploads/" });
const router = express.Router();
// Create a new card
router.post("/create", verifyToken, upload.single("image"), createCard);
// Get all cards
router.get("/get", verifyToken, getAllCards);
// Get a specific card by ID
router.get("/get/:id", getCardById);
router.get("/get/service/:cardId", getServicesByCardId);
router.get("/getby/:id?/:name?", getCardDetails);
// Update a card by ID
router.put("/update/:id", verifyToken, updateCard);
// Delete a card by ID
router.delete("/del/:id", verifyToken, deleteCard);
export default router;
