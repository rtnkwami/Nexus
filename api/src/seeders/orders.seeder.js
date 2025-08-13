import { Order, User, Shop } from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

export default async function seedOrders() {
  const users = await User.findAll();
  const shops = await Shop.findAll();

  const statuses = ['pending', 'completed', 'cancelled'];
  const ordersData = [];

  for (let i = 0; i < 200; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const shop = shops[Math.floor(Math.random() * shops.length)];

    ordersData.push({
      id: uuidv4(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      total: (Math.random() * 200 + 20).toFixed(2),
      UserId: user.id,
      ShopId: shop.id,
      createdAt: randomPastDate(),
      updatedAt: new Date()
    });
  }

  await Order.bulkCreate(ordersData);
}

function randomPastDate() {
  const now = new Date();
  const pastYear = new Date();
  pastYear.setFullYear(now.getFullYear() - 1);
  return new Date(pastYear.getTime() + Math.random() * (now.getTime() - pastYear.getTime()));
}
