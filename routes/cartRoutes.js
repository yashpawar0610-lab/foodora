const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

// Get cart page
router.get('/cart', (req, res) => {
  const cart = req.session.cart || [];
  const subtotal = cart.reduce((t, i) => t + (i.price * i.qty), 0);
  res.render('pages/cart', {
    title: 'Your Cart | FOODORA',
    cart,
    subtotal
  });
});

// Add to cart
router.post('/cart/add', async (req, res) => {
  try {
    const { restaurantId, restaurantName, itemId, name, price, image, isVeg, addons, spiceLevel, specialInstructions, qty } = req.body;

    if (!req.session.cart) req.session.cart = [];

    // If cart has items from a DIFFERENT restaurant, clear it
    if (req.session.cart.length > 0 && req.session.cart[0].restaurantId !== restaurantId) {
      req.session.cart = [];
    }

    const addonList = Array.isArray(addons) ? addons : (addons ? [addons] : []);
    const addonPrice = addonList.reduce((t, a) => {
      try { return t + JSON.parse(a).price; } catch { return t; }
    }, 0);
    const finalPrice = parseFloat(price) + addonPrice;

    // Find existing item (same item + same addons + same spice)
    const key = `${itemId}-${spiceLevel}-${addonList.join(',')}`;
    const existing = req.session.cart.find(i => i.key === key);

    if (existing) {
      existing.qty += parseInt(qty) || 1;
    } else {
      req.session.cart.push({
        key,
        restaurantId,
        restaurantName,
        itemId,
        name,
        price: finalPrice,
        basePrice: parseFloat(price),
        image: image || '',
        isVeg: isVeg === 'true',
        addons: addonList,
        spiceLevel: spiceLevel || 'Medium',
        specialInstructions: specialInstructions || '',
        qty: parseInt(qty) || 1
      });
    }

    const cartCount = req.session.cart.reduce((t, i) => t + i.qty, 0);
    const cartTotal = req.session.cart.reduce((t, i) => t + (i.price * i.qty), 0);

    res.json({ success: true, cartCount, cartTotal, message: `${name} added to cart!` });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: 'Failed to add item.' });
  }
});

// Update quantity
router.post('/cart/update', (req, res) => {
  try {
    const { key, qty } = req.body;
    if (!req.session.cart) return res.json({ success: false });
    const item = req.session.cart.find(i => i.key === key);
    if (item) {
      item.qty = parseInt(qty);
      if (item.qty <= 0) {
        req.session.cart = req.session.cart.filter(i => i.key !== key);
      }
    }
    const cartCount = req.session.cart.reduce((t, i) => t + i.qty, 0);
    const cartTotal = req.session.cart.reduce((t, i) => t + (i.price * i.qty), 0);
    res.json({ success: true, cartCount, cartTotal });
  } catch (err) {
    res.json({ success: false });
  }
});

// Remove from cart
router.post('/cart/remove', (req, res) => {
  try {
    const { key } = req.body;
    req.session.cart = (req.session.cart || []).filter(i => i.key !== key);
    const cartCount = req.session.cart.reduce((t, i) => t + i.qty, 0);
    const cartTotal = req.session.cart.reduce((t, i) => t + (i.price * i.qty), 0);
    res.json({ success: true, cartCount, cartTotal });
  } catch (err) {
    res.json({ success: false });
  }
});

// Clear cart
router.post('/cart/clear', (req, res) => {
  req.session.cart = [];
  res.json({ success: true });
});

// Apply coupon
router.post('/cart/coupon', (req, res) => {
  const { code, subtotal } = req.body;
  const sub = parseFloat(subtotal) || 0;

  const coupons = {
    'FIRST50': { type: 'percent', value: 50, max: 100, min: 199 },
    'HUNGRY20': { type: 'percent', value: 20, max: 999, min: 399 },
    'FREEDEL': { type: 'free_delivery', value: 0, min: 299 },
    'WEEKEND30': { type: 'percent', value: 30, max: 150, min: 499 },
    'SAVE100': { type: 'flat', value: 100, min: 599 },
    'NEWBIE': { type: 'flat', value: 75, min: 249 }
  };

  const coupon = coupons[code.toUpperCase()];
  if (!coupon) return res.json({ success: false, msg: 'Invalid coupon code.' });
  if (sub < coupon.min) return res.json({ success: false, msg: `Minimum order of ₹${coupon.min} required.` });

  let discount = 0;
  if (coupon.type === 'percent') {
    discount = Math.min(Math.round(sub * coupon.value / 100), coupon.max);
  } else if (coupon.type === 'flat') {
    discount = coupon.value;
  } else if (coupon.type === 'free_delivery') {
    discount = 0; // handled as free delivery flag
  }

  res.json({ success: true, discount, type: coupon.type, msg: `Coupon applied! You save ₹${discount}` });
});

module.exports = router;
