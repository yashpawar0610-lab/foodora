const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');
const User = require('../models/User');
const Review = require('../models/Review');
const { isAdmin } = require('../middleware/auth');

// Admin dashboard
router.get('/', isAdmin, async (req, res) => {
  try {
    const [totalRestaurants, totalOrders, totalUsers, totalRevenue] = await Promise.all([
      Restaurant.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }])
    ]);

    const recentOrders = await Order.find()
      .populate('user', 'name email').populate('restaurant', 'name')
      .sort({ createdAt: -1 }).limit(10);

    const topRestaurants = await Restaurant.find().sort({ rating: -1, totalOrders: -1 }).limit(5);

    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
    ]);

    res.render('pages/admin/dashboard', {
      title: 'Admin Dashboard | FOODORA',
      stats: {
        restaurants: totalRestaurants,
        orders: totalOrders,
        users: totalUsers,
        revenue: totalRevenue[0]?.total || 0
      },
      recentOrders,
      topRestaurants,
      ordersByStatus
    });
  } catch (err) {
    console.error(err);
    res.render('pages/admin/dashboard', { title: 'Admin Dashboard | FOODORA', stats: {}, recentOrders: [], topRestaurants: [], ordersByStatus: [] });
  }
});

// Manage restaurants
router.get('/restaurants', isAdmin, async (req, res) => {
  const restaurants = await Restaurant.find().sort({ createdAt: -1 });
  res.render('pages/admin/restaurants', { title: 'Manage Restaurants | FOODORA', restaurants });
});

// Toggle restaurant active
router.post('/restaurants/:id/toggle', isAdmin, async (req, res) => {
  try {
    const r = await Restaurant.findById(req.params.id);
    r.isActive = !r.isActive;
    await r.save();
    res.json({ success: true, isActive: r.isActive });
  } catch (err) {
    res.json({ success: false });
  }
});

// Manage orders
router.get('/orders', isAdmin, async (req, res) => {
  const { status } = req.query;
  const query = status ? { orderStatus: status } : {};
  const orders = await Order.find(query)
    .populate('user', 'name email phone').populate('restaurant', 'name')
    .sort({ createdAt: -1 }).limit(50);
  res.render('pages/admin/orders', { title: 'Manage Orders | FOODORA', orders, statusFilter: status });
});

// Update order status
router.post('/orders/:id/status', isAdmin, async (req, res) => {
  try {
    const { status, note } = req.body;
    const validStatuses = ['Placed', 'Confirmed', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) return res.json({ success: false });

    const order = await Order.findByIdAndUpdate(req.params.id, {
      orderStatus: status,
      $push: { statusHistory: { status, note: note || '' } },
      ...(status === 'Delivered' ? { deliveredAt: new Date() } : {})
    }, { new: true });

    res.json({ success: true, order });
  } catch (err) {
    res.json({ success: false });
  }
});

// Manage users
router.get('/users', isAdmin, async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.render('pages/admin/users', { title: 'Manage Users | FOODORA', users });
});

// Manage reviews
router.get('/reviews', isAdmin, async (req, res) => {
  const reviews = await Review.find().populate('user', 'name').populate('restaurant', 'name').sort({ createdAt: -1 });
  res.render('pages/admin/reviews', { title: 'Reviews | FOODORA', reviews });
});

// Delete review
router.post('/reviews/:id/delete', isAdmin, async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
