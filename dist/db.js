"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), '.env') });
const pool = new pg_1.Pool({
    host: 'aws-1-us-east-2.pooler.supabase.com',
    port: 6543,
    database: 'postgres',
    user: 'postgres.pezxcpupoqvktfarsaqg',
    password: 'Felipe359722$', // ¡No olvides poner tu clave!
    ssl: {
        rejectUnauthorized: false
    }
});
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Error de conexión:', err.message);
    }
    else {
        console.log('✅ ¡Conexión exitosa al Pooler de Supabase!');
    }
});
exports.default = pool;
