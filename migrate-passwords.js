import 'dotenv/config';
import bcrypt from 'bcrypt';
import pool from './db.js';

async function migratePasswords() {
  try {
    const { rows } = await pool.query('SELECT username, password FROM users');

    for (const user of rows) {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      await pool.query(
        'UPDATE users SET password = $1 WHERE username = $2',
        [hashedPassword, user.username]
      );

      console.log(`Usuario ${user.username} actualizado`);
    }

    console.log('✅ Migración completa');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error en migración:', error);
    process.exit(1);
  }
}

migratePasswords();