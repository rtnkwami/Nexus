import express from 'express';
import { appSession } from '../config/sessionConfig.js';
import { addToCart, getCart, removeFromCart, placeOrder } from '../controllers/cart.controller.js';
import checkJwt from '../utils/verifyJwt.js';

const router = express.Router();

router.use(appSession);

router.get('/', getCart);
router.post('/items', addToCart);
router.delete('/items/:id', removeFromCart);

export default router;