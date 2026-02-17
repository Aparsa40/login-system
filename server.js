require('dotenv').config();

const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');

const dbConnect = require('./config/db'); // فایل db.js که MongoDB رو کانکت میکنه
const authRoutes = require('./routes/auth');
const passportConfig = require('./config/passport');

const app = express();
const PORT = process.env.PORT || 5000;

// اتصال به MongoDB
dbConnect();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// فایل‌های استاتیک
app.use(express.static('public'));

// Session (برای Passport OAuth)
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecretkey',
  resave: false,
  saveUninitialized: false
}));

// Passport initialize & config
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);

// Routes
app.use('/api/auth', authRoutes);

// صفحه اصلی
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// سرور شروع شد
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
