import dotenv from 'dotenv';
dotenv.config();
import app from './app.js'
import { testDbConnection } from './config/dbConfig.js';
import { sequelize } from './models/index.js';


app.listen(3000, () => {
    console.log("Server running on port 3000");
});

await testDbConnection();

try {
    await sequelize.sync({ alter: true });
    console.log("Database synced");
} catch(error) {
    console.error('Error in database sync: ', error)
}

