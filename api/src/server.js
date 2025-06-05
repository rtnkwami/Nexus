import dotenv from 'dotenv';
dotenv.config();
import app from './app.js'
import { testDbConnection, sequelize } from './config/dbConfig.js';
import User from './models/User.js';
import Shop from './models/Shop.js';

async function startServer() {
  try {
    await sequelize.sync({ alter: true });
    console.log("Database synced");
    
    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

startServer();

testDbConnection();