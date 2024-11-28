import express from 'express';
import { createCard, getAllCards, getCardById, updateCard, deleteCard } from '../controllers/card.js';
const router = express.Router();
// Create a new card
router.post('/create', createCard);
// Get all cards
router.get('/get', getAllCards);
// Get a specific card by ID
router.get('/get/:id', getCardById);
// Update a card by ID
router.put('/update/:id', updateCard);
// Delete a card by ID
router.delete('/del/:id', deleteCard);
export default router;
