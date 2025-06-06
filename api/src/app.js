import dotenv from 'dotenv';
dotenv.config()
import express from 'express';
import userRoutes from './routes/user.routes.js';
const app = express();
import { auth } from 'express-oauth2-jwt-bearer';
import cors from 'cors';

const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: process.env.AUTH0_SIGINING_ALGORITHM
});

app.use(cors({
    origin: 'http://localhost:3000'
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRoutes);

app.get('/', checkJwt, (req, res) => {
    res.status(200).json({ message: "Correctly authenticated app!" });
    console.log(req.auth.payload);
})

export default app;