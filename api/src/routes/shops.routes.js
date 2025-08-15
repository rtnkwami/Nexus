import express from 'express';
import { 
    updateShopMetadata,
    createShopProduct,
    updateShopProduct,
    getShopProducts,
    getOneShopProduct,
    searchSuggestions,
    deleteShopProduct
} from '../controllers/shop.controller.js';
import { getShopOrders, getOneShopOrder, updateShopOrderStatus } from '../controllers/shop.controller.js';
import checkJwt from '../utils/verifyJwt.js';

const router = express.Router();

router.get('/:shopId/products', getShopProducts);
router.get('/products/:productId', getOneShopProduct);
router.get('/search-suggestions', checkJwt, searchSuggestions)
router.post('/products', checkJwt, createShopProduct);
router.put('/products/:productId', checkJwt, updateShopProduct);
router.delete('/products/:productId', checkJwt, deleteShopProduct);

router.put('/', checkJwt, updateShopMetadata);

router.get('/orders', checkJwt, getShopOrders);
router.get('/orders/:orderId', checkJwt, getOneShopOrder);
router.put('/orders/:orderId', checkJwt, updateShopOrderStatus);

export default router;