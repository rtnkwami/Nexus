import express from 'express';
import { getAllProducts, getOneProduct, getProductCategories } from '../controllers/product.controller.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/categories', getProductCategories);
router.get('/:productId', getOneProduct);

export default router;