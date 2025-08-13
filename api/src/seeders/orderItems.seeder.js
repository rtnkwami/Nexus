import { OrderItem, Order, Product } from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

export default async function seedOrderItems() {
  const orders = await Order.findAll();
  const products = await Product.findAll();

  const orderItemsData = [];

  for (const order of orders) {
    const numItems = Math.floor(Math.random() * 3) + 1;
    const chosenProducts = products.sort(() => 0.5 - Math.random()).slice(0, numItems);

    chosenProducts.forEach(product => {
      orderItemsData.push({
        id: uuidv4(),
        quantity: Math.floor(Math.random() * 5) + 1,
        priceAtTime: product.price,
        OrderId: order.id,
        ProductId: product.id
      });
    });
  }

  await OrderItem.bulkCreate(orderItemsData);
}
