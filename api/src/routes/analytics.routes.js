import express from 'express';
import checkJwt from '../utils/verifyJwt.js';
import { getTotalRevenue } from '../controllers/analytics.controller.js';


const router = express.Router();

router.get('/totalRevenue', checkJwt, getTotalRevenue)

export default router;