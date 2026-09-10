const KrakenClient = require('kraken-api');

const kraken = new KrakenClient(
  process.env.KRAKEN_API_KEY,
  process.env.KRAKEN_PRIVATE_KEY
);

module.exports = kraken;