import { faker } from '@faker-js/faker';
import { Order, OrderItem, Product, Shop, User } from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

// Use the same date range as ProductViews seeder
function randomPastDate() {
  const now = new Date();
  const pastYear = new Date();
  pastYear.setFullYear(now.getFullYear() - 1);
  return new Date(pastYear.getTime() + Math.random() * (now.getTime() - pastYear.getTime()));
}

export default async function seedOrders(){

    const users = await User.findAll({
        attributes: ['id']
    });
    const products = await Product.findAll({
        attributes: ['id', 'price', 'ShopId']
    });

    if (!users.length || !products.length) {
      console.log('⚠️ Cannot seed orders. Make sure you have existing users and products.');
      return;
    }

    const ordersToCreate = [];
    const orderItemsToCreate = [];

    for (let i = 0; i < 3000; i++) {
      const orderId = uuidv4();
      const randomUser = faker.helpers.arrayElement(users);

      // 1. Pick a random product to determine the shop for this order
      const firstProduct = faker.helpers.arrayElement(products);
      const shopIdForOrder = firstProduct.ShopId;
      
      // 2. Filter products to only those from the chosen shop
      const availableProductsInShop = products.filter(p => p.ShopId === shopIdForOrder);
      
      // 3. Select a few random products for the order (1 to 3 items)
      const itemsForThisOrder = faker.helpers.arrayElements(availableProductsInShop, { min: 1, max: 9 });
      
      let orderTotal = 0;
      const currentOrderItems = [];

      // 4. Create order items and calculate the total
      for (const product of itemsForThisOrder) {
        const quantity = faker.number.int({ min: 1, max: 5 });
        const priceAtTime = Number(product.price);
        orderTotal += quantity * priceAtTime;

        currentOrderItems.push({
          id: uuidv4(),
          quantity,
          priceAtTime,
          OrderId: orderId, // Link to the order being created
          ProductId: product.id,
        });
      }

      // 5. Create the order with consistent date range (same as ProductViews)
      const orderDate = randomPastDate();
      ordersToCreate.push({
        id: orderId,
        status: faker.helpers.arrayElement(['pending', 'completed', 'cancelled']),
        total: orderTotal.toFixed(2),
        UserId: randomUser.id,
        ShopId: shopIdForOrder,
        createdAt: orderDate,
        updatedAt: orderDate, // Keep them the same for simplicity
      });
      
      // 6. Add the items for this order to the main list
      orderItemsToCreate.push(...currentOrderItems);
    }
    
    await Order.bulkCreate(ordersToCreate);
    await OrderItem.bulkCreate(orderItemsToCreate);
    console.log(`Seeded ${ordersToCreate.length} orders with ${orderItemsToCreate.length} order items`);
};