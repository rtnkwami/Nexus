import { MetricHistory, Metric } from '../models/index.js';

export const getTotalShopRevenue = async (shopId, period) => {
    // Find the total_revenue metric
    const metric = await Metric.findOne({
        where: { name: 'total_revenue' }
    });

    if (!metric) {
        throw new Error('total_revenue metric not found');
    }

    // Get the latest metric for this period
    const result = await MetricHistory.findOne({
        where: {
            ShopId: shopId,
            MetricId: metric.id,
            category: period
        },
        order: [['periodStart', 'DESC']], // Get most recent
        raw: true
    });

    return result ? parseFloat(result.value) : 0;
};