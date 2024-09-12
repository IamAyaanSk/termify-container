import { config } from 'dotenv';
import path from 'path';
config();

const PORT: number = Number(process.env.PORT) || 3000;
const CONTAINER_ACCESS_TOKEN_SECRET: string = process.env.CONTAINER_ACCESS_TOKEN_SECRET || '';
const USER_CODE_BASE_PATH = path.resolve('..', '..', '..', 'home', 'damner', 'code');

export { PORT, CONTAINER_ACCESS_TOKEN_SECRET, USER_CODE_BASE_PATH };
