require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to Database
connectDB();

console.log('🚀 Server başlatılıyor...');
console.log('Port:', PORT);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log('\n' + '='.repeat(50));
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));
  console.log('Query:', JSON.stringify(req.query, null, 2));
  console.log('='.repeat(50) + '\n');
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
const hashRoutes = require("./routes/hash.routes");

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/hash', hashRoutes);
app.use('/api/transactions', transactionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`📍 API endpoint: http://localhost:${PORT}/api`);
  
  // Backend çalıştığını anlamak için heartbeat
  setInterval(() => {
    console.log('💓 Backend alive -', new Date().toLocaleTimeString());
  }, 5000);
  console.log('🔄 Middleware aktif - istekler loglanacak\n');
});
