import express from 'express';
import { appSession } from '../config/sessionConfig.js';
import checkJwt from '../utils/verifyJwt.js';
import { getAllOrders, getOneOrder } from '../controllers/order.controller.js';

const router = express.Router();

router.use(appSession);

router.get('/', checkJwt, getAllOrders);

router.get('/:orderId', getOneOrder);

export default router;