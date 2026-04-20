import { authMiddleware } from './auth';

export const onRequest = authMiddleware;
