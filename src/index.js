const express = require('express');
const app = express();
require('dotenv').config();
const main = require('./config/db.js');

const PORT = process.env.PORT || 3000;

app.use(express.json());

main()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT} without DB connection`);
    });
  });
