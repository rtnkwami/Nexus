import express from 'express';
import checkJwt from '../utils/verifyJwt.js';
import { overviewDashboard, salesPerformanceDashboard } from '../controllers/analytics.controller.js';


const router = express.Router();

router.get('/overview', checkJwt, overviewDashboard)
router.get('/sales-performance', checkJwt, salesPerformanceDashboard);

export default router;