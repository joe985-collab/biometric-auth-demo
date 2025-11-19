import fs from 'fs';
import path from 'path';
import pg from 'pg';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Client } = pg;

// Read .env file manually
const envPath = path.join(__dirname, '.env');
const envConfig = fs.readFileSync(envPath, 'utf8').split('\n').reduce((acc, line) => {
    const parts = line.split('=');
    if (parts.length >= 2) {
        const key = parts[0].trim();
        const val = parts.slice(1).join('=').trim();
        acc[key] = val;
    }
    return acc;
}, {});

const client = new Client({
    user: envConfig.DB_USER,
    host: envConfig.DB_HOST,
    database: envConfig.DB_NAME,
    password: envConfig.DB_PASS,
    port: envConfig.DB_PORT,
});

async function setup() {
    try {
        await client.connect();
        console.log('Connected to database');

        // Enable vector extension if not exists
        try {
            await client.query('CREATE EXTENSION IF NOT EXISTS vector;');
            console.log('Vector extension enabled');
        } catch (err) {
            console.log('Could not create vector extension (might already exist or permission denied):', err.message);
        }

        // Create table
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                face_embedding vector(512) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_login TIMESTAMP
            );
        `;
        await client.query(createTableQuery);
        console.log('Table "users" created');

        // Create index
        // Note: IF NOT EXISTS for index is a bit tricky in older PG versions, but usually fine to try/catch or check system catalogs.
        // For simplicity we'll just try to create it and catch error if it exists or use IF NOT EXISTS if supported (PG 9.5+ supports IF NOT EXISTS for indexes)
        const createIndexQuery = `
            CREATE INDEX IF NOT EXISTS users_face_embedding_idx ON users USING hnsw (face_embedding vector_l2_ops);
        `;
        await client.query(createIndexQuery);
        console.log('Index created');

    } catch (err) {
        console.error('Error setting up database:', err);
    } finally {
        await client.end();
    }
}

setup();
