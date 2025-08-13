import { Product, Shop } from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';
import { faker }from "@faker-js/faker";

export default async function seedProducts() {
  const shops = await Shop.findAll();
  if (!shops.length) throw new Error("No shops found.");

  const productsData = [];

  for (const shop of shops) {
    for (let i = 0; i < 10; i++) {
      productsData.push({
        id: uuidv4(),
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        category: faker.commerce.department(),
        price: faker.commerce.price({ min: 5, max: 100, dec: 2 }),
        stock: faker.number.int({ min: 1, max: 50 }),
        images: [],
        ShopId: shop.id,
        createdAt: randomPastDate(),
        updatedAt: new Date()
      });
    }
  }

  await Product.bulkCreate(productsData);
}

function randomPastDate() {
  const now = new Date();
  const pastYear = new Date();
  pastYear.setFullYear(now.getFullYear() - 1);
  return new Date(pastYear.getTime() + Math.random() * (now.getTime() - pastYear.getTime()));
}