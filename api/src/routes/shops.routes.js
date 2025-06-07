import express from 'express';
import { updateShopMetadata, createShopProduct, updateShopProduct } from '../controllers/shopController.js';
import checkJwt from '../utils/verifyJwt.js';

const router = express.Router();

router.post('/:id/products', checkJwt, createShopProduct);

router.put('/:id/products/:id', checkJwt, updateShopProduct);

router.put('/:id', checkJwt, updateShopMetadata);

export default router;