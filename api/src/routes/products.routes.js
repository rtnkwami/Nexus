import express from 'express';
import checkJwt from '../utils/verifyJwt.js';
import { getPaginatedProducts } from '../controllers/productController.js';

const router = express.Router();

router.get('/', getPaginatedProducts)

export default router;