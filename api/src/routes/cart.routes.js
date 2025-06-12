import express from 'express';
import { appSession } from '../config/sessionConfig.js';
import { addToCart, getCart, removeFromCart } from '../controllers/cartController.js';
import { get } from 'http';

const router = express.Router();

router.use(appSession);

router.get('/', getCart)
router.post('/', addToCart);
router.delete('/:id', removeFromCart)

export default router;