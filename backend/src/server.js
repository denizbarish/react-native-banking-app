require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'Banking API is running' });
});

const authRoutes = require('./routes/auth.routes');
const accountRoutes = require('./routes/account.routes');
const transactionRoutes = require('./routes/transaction.routes');
const adminRoutes = require('./routes/admin.routes');
const hashRoutes = require("./routes/hash.routes");
const cardRoutes = require('./routes/card.routes');
const loanRoutes = require('./routes/loan.routes');
const exchangeRoutes = require('./routes/exchange.routes');

app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/hash', hashRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/loan', loanRoutes);
app.use('/api/exchange', exchangeRoutes);

app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Bir hata oluştu' });
});

app.listen(PORT, () => {
  console.log(`Backend ${PORT} portunda çalışıyor`);
});
