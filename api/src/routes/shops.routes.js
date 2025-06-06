import express from 'express';
import { updateShop } from '../controllers/shopController.js';
import checkJwt from '../utils/verifyJwt.js';

const router = express.Router();

router.put('/', checkJwt, updateShop);

export default router;