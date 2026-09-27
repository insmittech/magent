import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

function buildDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || 3306;
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'magnet_db';

  return `mysql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${database}`;
}

const dbUrl = buildDatabaseUrl();
process.env.DATABASE_URL = dbUrl;

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbUrl
    }
  }
});

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('✅ MySQL Database connected via Prisma Client.');
  } catch (error) {
    console.warn('⚠️ MySQL connection note:', error.message);
  }
};
