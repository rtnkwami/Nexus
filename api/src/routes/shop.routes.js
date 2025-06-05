import express from 'express';
import { createShop } from '../controllers/shopController.js';

const router = express.Router();

router.post('/', createShop);

export default router;