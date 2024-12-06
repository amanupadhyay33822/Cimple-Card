import express from "express";
import {
  createCard,
  getAllCards,
  getCardById,
  updateCard,
  deleteCard,
} from "../controllers/card.js";
import { verifyToken } from "../middleware/auth.js";


const router = express.Router();

// Create a new card
router.post("/create", verifyToken,createCard);

// Get all cards
router.get("/get", verifyToken,getAllCards);

// Get a specific card by ID
router.get("/get/:id", verifyToken,getCardById);

// Update a card by ID
router.put("/update/:id",  verifyToken,updateCard);

// Delete a card by ID
router.delete("/del/:id", verifyToken, deleteCard);

export default router;
