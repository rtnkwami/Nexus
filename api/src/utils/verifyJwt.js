import dotenv from 'dotenv';
dotenv.config();
import { auth } from 'express-oauth2-jwt-bearer';

const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: process.env.AUTH0_SIGINING_ALGORITHM
});

export default checkJwt;