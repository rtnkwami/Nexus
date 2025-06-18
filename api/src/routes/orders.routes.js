import express from 'express';
import { appSession } from '../config/sessionConfig.js';
import checkJwt from '../utils/verifyJwt.js';
import { getAllOrders } from '../controllers/order.controller.js';

const router = express.Router();

router.use(appSession);

router.get('/', checkJwt, getAllOrders);

export default router;