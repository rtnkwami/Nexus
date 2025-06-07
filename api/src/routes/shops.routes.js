import express from 'express';
import { updateShopMetadata, createShopProduct, updateShopProduct, getShopProducts } from '../controllers/shopController.js';
import checkJwt from '../utils/verifyJwt.js';

const router = express.Router();

router.get('/:id/products', checkJwt, getShopProducts)

router.post('/:id/products', checkJwt, createShopProduct);

router.put('/:id/products/:id', checkJwt, updateShopProduct);

router.put('/:id', checkJwt, updateShopMetadata);

export default router;