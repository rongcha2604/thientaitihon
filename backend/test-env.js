// Quick test script to check if .env loads
import dotenv from 'dotenv';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '.env');
console.log('Testing .env loading...');
console.log('Path:', envPath);
console.log('Exists:', existsSync(envPath));

const result = dotenv.config({ path: envPath });
console.log('Result:', result);

if (result.error) {
  console.error('Error:', result.error);
} else {
  console.log('Success!');
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'LOADED' : 'NOT FOUND');
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'LOADED' : 'NOT FOUND');
}

