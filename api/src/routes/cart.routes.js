import express from 'express';
import { appSession } from '../config/sessionConfig.js';
import { addToCart, getCart, removeFromCart, editCartItem } from '../controllers/cart.controller.js';

const router = express.Router();

router.use(appSession);

router.get('/', getCart);
router.post('/', addToCart);
router.put('/:productId', editCartItem);
router.delete('/:productId', removeFromCart);

export default router;