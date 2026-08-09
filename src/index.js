const express = require('express');
const app = express();
require('dotenv').config();
const main = require('./config/db.js');
const authRouter = require('./routes/userAuth');

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/user', authRouter);

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
