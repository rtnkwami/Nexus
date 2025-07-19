import { Op, fn, literal } from 'sequelize';
import OrderItem from '../models/OrderItem.js';
import Order from '../models/Order.js'

export const getTotalShopRevenue = async (shopId, startDate, endDate) => {
    const result = await OrderItem.findOne({
        attributes: [
            [fn('SUM', literal('"OrderItem"."quantity" * "OrderItem"."priceAtTime"')), 'totalRevenue']
        ],
        include: [{
            model: Order,
            required: true,
            attributes: [],
            where: {
                ShopId: shopId,
                createdAt: {
                    [Op.between]: [startDate, endDate],
                }
            }
        }],
        raw: true
  });

  return result.totalRevenue ? parseFloat(result.totalRevenue) : 0;
}