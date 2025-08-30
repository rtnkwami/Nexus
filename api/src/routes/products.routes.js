import express from 'express';
import {
    getAllProducts,
    getOneProduct,
    getProductCategories,
    searchSuggestions,
    getPopularProducts
} from '../controllers/product.controller.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/search-suggestions', searchSuggestions)
router.get('/categories', getProductCategories);
router.get('/categories/:category/popular', getPopularProducts);
router.get('/:productId', getOneProduct);

export default router;