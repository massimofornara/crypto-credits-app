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

    // Crea la tabella users (se non esiste)
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Crea la tabella withdrawals (se non esiste)
    await client.query(`
      CREATE TABLE IF NOT EXISTS withdrawals (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        amount DECIMAL(15, 8) NOT NULL,
        currency VARCHAR(10) NOT NULL,
        wallet_address VARCHAR(255) NOT NULL,
        wallet_type VARCHAR(50) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW(),
        liquidation_date TIMESTAMP
      );
    `);

    console.log("Tabelle 'users' e 'withdrawals' create o già esistenti.");
    client.release();
  } catch (error) {
    console.error("Errore nella creazione delle tabelle:", error);
  }
}

// Chiamata all'avvio
initializeDatabase();

module.exports = { pool, initializeDatabase };
