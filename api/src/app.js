import express from 'express';
import userRoutes from './routes/user.routes.js';
import shopRoutes from './routes/shops.routes.js'
import productRoutes from './routes/products.routes.js'
const app = express();
import checkJwt from './utils/verifyJwt.js';
import cors from 'cors';

app.use(cors({
    origin: 'http://localhost:3000'
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRoutes);
app.use('/shops', shopRoutes);
app.use('/products', productRoutes);

app.get('/', checkJwt, (req, res) => {
    res.status(200).json({ message: "Correctly authenticated app!" });
    console.log(req.auth.payload);
})

export default app;