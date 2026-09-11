const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Funzione per inizializzare il database
async function initializeDatabase() {
  try {
    const client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("Tabella 'users' creata o già esistente.");
    client.release();
  } catch (error) {
    console.error("Errore nella creazione della tabella 'users':", error);
  }
}

// Chiamata all'avvio
initializeDatabase();

module.exports = { pool, initializeDatabase };
