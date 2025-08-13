import dotenv from 'dotenv';
dotenv.config();

import { sequelize } from '../models/index.js';

import seedProducts from './products.seeder.js';
import seedOrders from './orders.seeder.js';
import seedOrderItems from './orderItems.seeder.js';
import seedProductViews from './productViews.seeder.js';

(async () => {
  try {
    console.log("🌱 Starting database seeding...");

    // Test DB connection
    await sequelize.authenticate();
    console.log("✅ Database connection established.");

    // PRODUCTS
    console.log("📦 Seeding Products...");
    await seedProducts();
    console.log("✅ Products seeded.");

    // ORDERS
    console.log("🛒 Seeding Orders...");
    await seedOrders();
    console.log("✅ Orders seeded.");

    // ORDER ITEMS
    console.log("📑 Seeding Order Items...");
    await seedOrderItems();
    console.log("✅ Order Items seeded.");

    // PRODUCT VIEWS
    console.log("👀 Seeding Product Views...");
    await seedProductViews();
    console.log("✅ Product Views seeded.");

    console.log("🎉 Seeding completed successfully!");
    process.exit(0);

  } catch (err) {
    console.error("❌ Error seeding database:", err);
    process.exit(1);
  }
})();