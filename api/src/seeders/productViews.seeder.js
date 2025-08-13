import { ProductView, Product } from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

export default async function seedProductViews() {
  const products = await Product.findAll();
  const viewsData = [];

  for (const product of products) {
    const numViews = Math.floor(Math.random() * 50) + 10;
    for (let i = 0; i < numViews; i++) {
      viewsData.push({
        id: uuidv4(),
        ProductId: product.id,
        viewedAt: randomPastDate()
      });
    }
  }

  await ProductView.bulkCreate(viewsData);
}

function randomPastDate() {
  const now = new Date();
  const pastYear = new Date();
  pastYear.setFullYear(now.getFullYear() - 1);
  return new Date(pastYear.getTime() + Math.random() * (now.getTime() - pastYear.getTime()));
}
