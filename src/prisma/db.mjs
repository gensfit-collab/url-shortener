import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

// Create a single PrismaClient instance
export const db = new PrismaClient();

