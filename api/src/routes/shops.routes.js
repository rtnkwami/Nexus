import express from 'express';
import { updateShopMetadata } from '../controllers/shopController.js';
import checkJwt from '../utils/verifyJwt.js';

const router = express.Router();

router.put('/:id', checkJwt, updateShopMetadata);

export default router;