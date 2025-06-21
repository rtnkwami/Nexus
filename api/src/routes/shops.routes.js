import express from 'express';
import { 
    updateShopMetadata,
    createShopProduct,
    updateShopProduct,
    getShopProducts,
    getOneShopProduct,
    deleteShopProduct
} from '../controllers/shop.controller.js';
import { getShopOrders } from '../controllers/shop.controller.js';
import checkJwt from '../utils/verifyJwt.js';

const router = express.Router();

router.get('/products', checkJwt, getShopProducts);
router.get('/products/:productId', checkJwt, getOneShopProduct);
router.post('/products', checkJwt, createShopProduct);
router.put('/products/:productId', checkJwt, updateShopProduct);
router.delete('/products/:productId', checkJwt, deleteShopProduct);

router.put('/', checkJwt, updateShopMetadata);

router.get('/orders', checkJwt, getShopOrders);

export default router;