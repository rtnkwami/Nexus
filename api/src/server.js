import app from './app.js'
import { testDbConnection } from './config/dbConfig.js';

app.listen(5000, () => {
    console.log('Server is up and running...');
});

testDbConnection();