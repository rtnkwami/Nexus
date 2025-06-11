import express from 'express';
import { appSession } from '../config/sessionConfig.js';
import { addToCart } from '../controllers/cartController.js';

const router = express.Router();

router.use(appSession);

router.get('/', addToCart);

export default router;