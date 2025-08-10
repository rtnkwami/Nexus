import express from 'express';
import userRoutes from './routes/user.routes.js';
import shopRoutes from './routes/shops.routes.js';
import productRoutes from './routes/products.routes.js';
import cartRoutes from './routes/cart.routes.js';
import analyticsRoutes from './routes/analytics.routes.js'
import checkJwt from './utils/verifyJwt.js';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRoutes);
app.use('/shops', shopRoutes);
app.use('/products', productRoutes);
app.use('/carts', cartRoutes);
app.use('/analytics', analyticsRoutes);

app.get('/', checkJwt, (req, res) => {
    res.status(200).json({ message: "Correctly authenticated app!" });
})

export default app;