import express from 'express';
import checkJwt from '../utils/verifyJwt.js';
import { createProduct, updateProduct } from '../controllers/productController.js';

const router = express.Router();

router.post('/', checkJwt, createProduct);

router.put('/:id', updateProduct);

export default router;