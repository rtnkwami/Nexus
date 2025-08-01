import express from 'express';
import checkJwt from '../utils/verifyJwt.js';
import { overviewDashboard } from '../controllers/analytics.controller.js';


const router = express.Router();

router.get('/totalRevenue', checkJwt, overviewDashboard)

export default router;