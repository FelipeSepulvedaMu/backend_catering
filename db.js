import 'dotenv/config';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: 'aws-1-us-east-2.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.pezxcpupoqvktfarsaqg',
  password: 'Felipe359722$',
  ssl: {
    rejectUnauthorized: false
  }
});

export default pool;