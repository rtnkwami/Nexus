import express from 'express';
import { getUserMetadata } from '../controllers/userController.js';
import checkJwt from '../utils/verifyJwt.js';

const router = express.Router();

router.post('/', checkJwt, getUserMetadata);

export default router;