import { ProductView, Product, OrderItem, Order } from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

export default async function seedProductViews() {
  const products = await Product.findAll();
  const viewsData = [];

  for (const product of products) {
    // Get all orders containing this product with their dates
    const ordersWithProduct = await OrderItem.findAll({
      include: [{
        model: Order,
        attributes: ['createdAt']
      }],
      where: {
        ProductId: product.id
      }
    });

    const purchaseCount = ordersWithProduct.length;

    if (purchaseCount === 0) {
      // Product has no purchases, generate random views over past year
      const numViews = Math.floor(Math.random() * 50) + 10;
      for (let i = 0; i < numViews; i++) {
        viewsData.push({
          id: uuidv4(),
          ProductId: product.id,
          viewedAt: randomPastDate()
        });
      }
    } else {
      // Product has purchases, generate views strategically
      const orderDates = ordersWithProduct.map(orderItem => orderItem.Order.createdAt);
      const earliestOrderDate = new Date(Math.min(...orderDates));
      const latestOrderDate = new Date(Math.max(...orderDates));
      
      // Generate views >= purchase count
      const minViews = purchaseCount;
      const maxViews = purchaseCount + 50;
      const numViews = Math.floor(Math.random() * (maxViews - minViews + 1)) + minViews;

      for (let i = 0; i < numViews; i++) {
        // 70% of views should be before/around purchase dates
        // 30% can be after the latest purchase (people viewing but not buying)
        if (Math.random() < 0.7) {
          // Generate view between earliest order date and latest order date
          const viewDate = new Date(
            earliestOrderDate.getTime() + 
            Math.random() * (latestOrderDate.getTime() - earliestOrderDate.getTime())
          );
          
          // Bias toward dates closer to actual order dates
          if (Math.random() < 0.4) {
            // Pick a random order date and generate view within 7 days before it
            const randomOrderDate = orderDates[Math.floor(Math.random() * orderDates.length)];
            const sevenDaysBefore = new Date(randomOrderDate.getTime() - (7 * 24 * 60 * 60 * 1000));
            const finalViewDate = new Date(
              sevenDaysBefore.getTime() + 
              Math.random() * (randomOrderDate.getTime() - sevenDaysBefore.getTime())
            );
            
            viewsData.push({
              id: uuidv4(),
              ProductId: product.id,
              viewedAt: finalViewDate
            });
          } else {
            viewsData.push({
              id: uuidv4(),
              ProductId: product.id,
              viewedAt: viewDate
            });
          }
        } else {
          // Generate view after latest purchase (browsing but not buying)
          const now = new Date();
          const viewDate = new Date(
            latestOrderDate.getTime() + 
            Math.random() * (now.getTime() - latestOrderDate.getTime())
          );
          
          viewsData.push({
            id: uuidv4(),
            ProductId: product.id,
            viewedAt: viewDate
          });
        }
      }
    }
  }

  await ProductView.bulkCreate(viewsData);
  console.log(`Seeded ${viewsData.length} product views with date-aware logic`);
}

function randomPastDate() {
  const now = new Date();
  const pastYear = new Date();
  pastYear.setFullYear(now.getFullYear() - 1);
  return new Date(pastYear.getTime() + Math.random() * (now.getTime() - pastYear.getTime()));
}