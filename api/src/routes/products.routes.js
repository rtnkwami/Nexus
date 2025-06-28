import express from 'express';
import { getAllProducts, getOneProduct, getProductCategories } from '../controllers/product.controller.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:productId', getOneProduct);
router.get('/categories', getProductCategories);

export default router;