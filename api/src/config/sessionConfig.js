import dotenv from 'dotenv';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const appSession = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUnitialised: false,
    cookie: { secure: false, maxAge: 86400000 }
});