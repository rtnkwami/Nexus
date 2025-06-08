import express from 'express';
import { 
    updateShopMetadata,
    createShopProduct,
    updateShopProduct,
    getShopProducts,
    getOneShopProduct,
    deleteShopProduct
} from '../controllers/shopController.js';
import checkJwt from '../utils/verifyJwt.js';

const router = express.Router();

router.get('/:shopId/products', checkJwt, getShopProducts);

router.get('/:shopId/products/:productId', checkJwt, getOneShopProduct);

router.post('/:shopId/products', checkJwt, createShopProduct);

router.put('/:shopId/products/:productId', checkJwt, updateShopProduct);

router.delete('/:shopId/products/:productId', deleteShopProduct);

router.put('/:shopId', checkJwt, updateShopMetadata);

export default router;