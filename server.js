const express = require('express');
const cors = require('cors');
const dbConnect = require('./config/db');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// اتصال به MongoDB
dbConnect();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// سرور شروع شد
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
