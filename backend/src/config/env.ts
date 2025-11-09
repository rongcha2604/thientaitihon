import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file BEFORE parsing
// Try multiple paths (prioritize process.cwd() since we run from backend folder)
const possiblePaths = [
  path.resolve(process.cwd(), '.env'), // First try: current working directory (backend folder)
  path.resolve(__dirname, '../../.env'), // Second try: relative to this file
  '.env', // Third try: relative path
];

let envPath: string | undefined;
let loaded = false;

for (const possiblePath of possiblePaths) {
  if (existsSync(possiblePath)) {
    envPath = possiblePath;
    console.log('🔍 Found .env at:', envPath);
    const result = dotenv.config({ path: envPath });
    if (!result.error) {
      loaded = true;
      console.log('✅ .env loaded successfully');
      break;
    } else {
      console.error('❌ Error loading .env:', result.error);
    }
  }
}

if (!loaded) {
  console.error('❌ Could not find .env file in any of these locations:');
  possiblePaths.forEach(p => console.error('  -', p));
}

console.log('🔍 DATABASE_URL:', process.env.DATABASE_URL ? 'LOADED' : 'NOT FOUND');
console.log('🔍 JWT_SECRET:', process.env.JWT_SECRET ? 'LOADED' : 'NOT FOUND');
console.log('🔍 JWT_REFRESH_SECRET:', process.env.JWT_REFRESH_SECRET ? 'LOADED' : 'NOT FOUND');

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  PORT: z.string().default('3001'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
});

// Parse with better error handling
let env;
try {
  env = envSchema.parse({
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    FRONTEND_URL: process.env.FRONTEND_URL,
  });
} catch (error) {
  console.error('❌ Environment validation failed!');
  console.error('Error details:', error);
  console.error('\n📋 Current process.env values:');
  console.error('  DATABASE_URL:', process.env.DATABASE_URL || '(undefined)');
  console.error('  JWT_SECRET:', process.env.JWT_SECRET ? `${process.env.JWT_SECRET.substring(0, 10)}...` : '(undefined)');
  console.error('  JWT_REFRESH_SECRET:', process.env.JWT_REFRESH_SECRET ? `${process.env.JWT_REFRESH_SECRET.substring(0, 10)}...` : '(undefined)');
  console.error('\n💡 Make sure .env file exists in backend/ folder');
  throw error;
}

export default env;

