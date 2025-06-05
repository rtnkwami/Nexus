import express from 'express';
import shopRoutes from './routes/shop.routes.js';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/shops', shopRoutes);

export default app;