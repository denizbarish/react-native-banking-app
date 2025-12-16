require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

console.log('🚀 Server başlatılıyor...');
console.log('Port:', PORT);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`\n📥 ${req.method} ${req.url}`);
  console.log('Body:', req.body);
  console.log('Query:', req.query);
  console.log('Params:', req.params);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Banking API is running' });
});

// Import routes here
const authRoutes = require('./routes/auth.routes');
const accountRoutes = require('./routes/account.routes');
const transactionRoutes = require('./routes/transaction.routes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`📍 API endpoint: http://localhost:${PORT}/api`);
  console.log('🔄 Middleware aktif - istekler loglanacak\n');
});
