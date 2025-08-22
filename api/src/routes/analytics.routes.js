import express from 'express';
import checkJwt from '../utils/verifyJwt.js';
import { 
    overviewDashboard,
    salesPerformanceDashboard,
    productInsightsDashboard,
    productAnalytics,
    getOverviewInsights
} from '../controllers/analytics.controller.js';


const router = express.Router();

router.get('/overview', checkJwt, overviewDashboard)
router.get('/sales-performance', checkJwt, salesPerformanceDashboard);
router.get('/product-insights', checkJwt, productInsightsDashboard);
router.get('/product-insights/:productId', checkJwt, productAnalytics)

export default router;