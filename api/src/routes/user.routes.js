import express from 'express';
import { getUser } from '../controllers/userController.js';
import checkJwt from '../utils/verifyJwt.js';

const router = express.Router();

router.post('/', checkJwt, getUser);

export default router;