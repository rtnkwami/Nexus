import express from 'express';
import { getAllProducts, getOneProduct, getProductCategories, searchSuggestions } from '../controllers/product.controller.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/search-suggestions', searchSuggestions)
router.get('/categories', getProductCategories);
router.get('/:productId', getOneProduct);

export default router;