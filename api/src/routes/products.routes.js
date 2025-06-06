import express from 'express';
import checkJwt from '../utils/verifyJwt.js';
import { createProduct } from '../controllers/productController.js';

const router = express.Router();

router.put('/', checkJwt, createProduct);

export default router;