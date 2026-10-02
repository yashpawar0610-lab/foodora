const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');
const { isOwner } = require('../middleware/auth');

// Owner dashboard
router.get('/dashboard', isOwner, async (req, res) => {
  try {
    const myRestaurant = await Restaurant.findOne({ owner: req.session.user._id });
    if (!myRestaurant) return res.render('pages/restaurant-owner/setup', { title: 'Setup Restaurant | FOODORA' });

    const orders = await Order.find({ restaurant: myRestaurant._id }).sort({ createdAt: -1 }).limit(20);
    const totalRevenue = orders.filter(o => o.orderStatus === 'Delivered')
      .reduce((t, o) => t + o.totalAmount, 0);

    res.render('pages/restaurant-owner/dashboard', {
      title: 'Owner Dashboard | FOODORA',
      restaurant: myRestaurant,
      orders,
      stats: {
        totalOrders: orders.length,
        revenue: totalRevenue,
        rating: myRestaurant.rating,
        menuItems: myRestaurant.menu.length
      }
    });
  } catch (err) {
    res.redirect('/');
  }
});

// Setup restaurant POST
router.post('/setup', isOwner, async (req, res) => {
  try {
    const { name, description, city, area, pincode, address, cuisine, priceForTwo, deliveryTime, coverImage } = req.body;
    const cuisineArr = cuisine.split(',').map(c => c.trim()).filter(Boolean);
    const restaurant = await Restaurant.create({
      name,
      description,
      owner: req.session.user._id,
      city,
      area,
      pincode,
      address,
      cuisine: cuisineArr,
      priceForTwo: parseFloat(priceForTwo) || 400,
      deliveryTime: parseInt(deliveryTime) || 30,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
      rating: 4.5,
      totalReviews: 1,
      minOrder: 149,
      isActive: true,
      menu: [
        {
          name: 'Special Signature Dish',
          description: 'Chef recommendation crafted with seasonal ingredients and traditional spices',
          price: 299,
          category: 'Main Course',
          isVeg: true,
          spiceLevels: ['Mild', 'Medium', 'Spicy'],
          isAvailable: true
        }
      ]
    });
    req.session.flash = { type: 'success', msg: 'Restaurant registered successfully! Welcome aboard.' };
    res.redirect('/owner/dashboard');
  } catch (err) {
    console.error(err);
    res.redirect('/owner/dashboard');
  }
});

// Edit menu item
router.post('/menu/add', isOwner, async (req, res) => {
  try {
    const r = await Restaurant.findOne({ owner: req.session.user._id });
    if (!r) return res.json({ success: false });
    const { name, description, price, category, isVeg } = req.body;
    r.menu.push({ name, description, price: parseFloat(price), category, isVeg: isVeg === 'true', spiceLevels: ['Mild', 'Medium', 'Spicy'] });
    await r.save();
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false });
  }
});

// Toggle menu item availability
router.post('/menu/:itemId/toggle', isOwner, async (req, res) => {
  try {
    const r = await Restaurant.findOne({ owner: req.session.user._id });
    const item = r.menu.id(req.params.itemId);
    if (!item) return res.json({ success: false });
    item.isAvailable = !item.isAvailable;
    await r.save();
    res.json({ success: true, isAvailable: item.isAvailable });
  } catch (err) {
    res.json({ success: false });
  }
});

// Update order status
router.post('/order/:id/status', isOwner, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.json({ success: false });
    order.orderStatus = status;
    order.statusHistory.push({ status, note: 'Updated by restaurant' });
    await order.save();
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false });
  }
});

module.exports = router;
