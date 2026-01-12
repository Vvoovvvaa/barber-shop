import { registerAs } from '@nestjs/config';

export const mongoConfig = registerAs('mongo', () => ({
  uri: process.env.MONGO_URI,
  dbName: process.env.MONGO_DB_NAME,
  user: process.env.MONGO_USER,
  password: process.env.MONGO_PASSWORD,
}));