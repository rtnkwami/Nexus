import express from 'express';
import { appSession } from '../config/sessionConfig.js';
import { getUserMetadata, getUserCart } from '../controllers/user.controller.js';
import checkJwt from '../utils/verifyJwt.js';

const router = express.Router();

router.use(appSession);

router.post('/', checkJwt, getUserMetadata);

export default router;