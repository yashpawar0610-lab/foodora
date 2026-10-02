const express = require('express');
const path = require('path');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const seedDatabase = require('./seeds/seed');
const Restaurant = require('./models/Restaurant');

const app = express();

// Connect to MongoDB & seed if empty
connectDB().then(async () => {
  try {
    const count = await Restaurant.countDocuments();
    if (count === 0) {
      console.log('[SERVER] Empty database detected. Seeding FOODORA data...');
      await seedDatabase();
    } else {
      console.log(`[SERVER] Database ready with ${count} restaurants.`);
    }
  } catch (err) {
    console.warn('[SERVER] Seed check warning:', err.message);
  }
});

// Body Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'foodora_secret_key_2026',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Templating
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Global template variables
app.use(async (req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.cart = req.session.cart || [];
  res.locals.cartCount = (req.session.cart || []).reduce((t, i) => t + i.qty, 0);
  res.locals.cartTotal = (req.session.cart || []).reduce((t, i) => t + (i.price * i.qty), 0);
  res.locals.userLocation = req.session.location || { city: 'Pune', area: '', pincode: '' };
  res.locals.currentPath = req.path;
  res.locals.query = req.query;
  res.locals.flash = req.session.flash || null;
  if (req.session.flash) delete req.session.flash;
  next();
});

// Routes
app.use('/', require('./routes/indexRoutes'));
app.use('/', require('./routes/authRoutes'));
app.use('/', require('./routes/restaurantRoutes'));
app.use('/', require('./routes/cartRoutes'));
app.use('/', require('./routes/orderRoutes'));
app.use('/', require('./routes/reviewRoutes'));
app.use('/', require('./routes/searchRoutes'));
app.use('/admin', require('./routes/adminRoutes'));
app.use('/owner', require('./routes/ownerRoutes'));

// 404
app.use((req, res) => {
  res.status(404).render('pages/error', {
    title: '404 - Not Found | FOODORA',
    message: 'The page you\'re looking for doesn\'t exist.',
    code: 404
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[ERROR]:', err);
  res.status(500).render('pages/error', {
    title: 'Server Error | FOODORA',
    message: 'Something went wrong on our end.',
    code: 500
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
  🍕 ============================================ 🍕
  🚀  FOODORA - Food Delivery Platform Running!
      👉 Local:   http://localhost:${PORT}
      👉 Network: http://0.0.0.0:${PORT}
  👤  Admin:    admin@foodora.com / admin123
  👤  Customer: user@foodora.com  / user123
  👤  Owner:    owner@foodora.com / owner123
  🍕 ============================================ 🍕
  `);
});

module.exports = app;
