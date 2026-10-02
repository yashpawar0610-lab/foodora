const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { isAuth, isGuest } = require('../middleware/auth');

// GET Login
router.get('/login', isGuest, (req, res) => {
  res.render('pages/login', {
    title: 'Login | FOODORA',
    msg: req.query.msg || null
  });
});

// POST Login
router.post('/login', isGuest, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !(await user.matchPassword(password))) {
      return res.render('pages/login', {
        title: 'Login | FOODORA',
        msg: 'Invalid email or password.',
        error: true
      });
    }
    req.session.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
      location: user.location
    };
    if (user.location && user.location.city) {
      req.session.location = user.location;
    }
    const returnTo = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(returnTo);
  } catch (err) {
    console.error(err);
    res.render('pages/login', { title: 'Login | FOODORA', msg: 'Server error. Try again.', error: true });
  }
});

// GET Register
router.get('/register', isGuest, (req, res) => {
  res.render('pages/register', { title: 'Register | FOODORA', msg: null });
});

// POST Register
router.post('/register', isGuest, async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.render('pages/register', { title: 'Register | FOODORA', msg: 'Email already registered.' });
    }
    const allowedRoles = ['customer', 'restaurant_owner'];
    const userRole = allowedRoles.includes(role) ? role : 'customer';
    const user = await User.create({ name, email, password, phone: phone || '', role: userRole });
    req.session.user = {
      _id: user._id, name: user.name, email: user.email,
      role: user.role, avatar: user.avatar, phone: user.phone,
      location: { city: 'Pune', area: '', pincode: '' }
    };
    req.session.flash = { type: 'success', msg: 'Welcome to FOODORA! 🎉' };
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('pages/register', { title: 'Register | FOODORA', msg: 'Registration failed. Try again.' });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Account / Profile
router.get('/account', isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id).populate('favorites');
    const Order = require('../models/Order');
    const orders = await Order.find({ user: req.session.user._id })
      .sort({ createdAt: -1 }).limit(10);
    res.render('pages/account', { title: 'My Account | FOODORA', user, orders });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// Update profile
router.post('/account/update', isAuth, async (req, res) => {
  try {
    const { name, phone, city, area, pincode } = req.body;
    await User.findByIdAndUpdate(req.session.user._id, {
      name, phone,
      location: { city, area, pincode }
    });
    req.session.user.name = name;
    req.session.user.phone = phone;
    req.session.user.location = { city, area, pincode };
    req.session.location = { city, area, pincode };
    req.session.flash = { type: 'success', msg: 'Profile updated successfully.' };
    res.redirect('/account');
  } catch (err) {
    console.error(err);
    res.redirect('/account');
  }
});

// Add address
router.post('/account/address', isAuth, async (req, res) => {
  try {
    const { label, street, area, city, pincode } = req.body;
    await User.findByIdAndUpdate(req.session.user._id, {
      $push: { addresses: { label, street, area, city, pincode } }
    });
    req.session.flash = { type: 'success', msg: 'Address added.' };
    res.redirect('/account');
  } catch (err) {
    res.redirect('/account');
  }
});

// Toggle favorite restaurant
router.post('/favorites/toggle', isAuth, async (req, res) => {
  try {
    const { restaurantId } = req.body;
    const user = await User.findById(req.session.user._id);
    const idx = user.favorites.indexOf(restaurantId);
    if (idx === -1) {
      user.favorites.push(restaurantId);
    } else {
      user.favorites.splice(idx, 1);
    }
    await user.save();
    res.json({ success: true, favorited: idx === -1 });
  } catch (err) {
    res.json({ success: false });
  }
});

module.exports = router;
