const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');
const { isAuth } = require('../middleware/auth');

// Checkout page
router.get('/checkout', isAuth, (req, res) => {
  const cart = req.session.cart || [];
  if (cart.length === 0) return res.redirect('/cart');

  const subtotal = cart.reduce((t, i) => t + (i.price * i.qty), 0);
  const deliveryFee = subtotal >= 299 ? 0 : (cart[0] ? 40 : 0);
  const taxes = Math.round(subtotal * 0.05);

  res.render('pages/checkout', {
    title: 'Checkout | FOODORA',
    cart,
    subtotal,
    deliveryFee,
    taxes
  });
});

// Place order
router.post('/order/place', isAuth, async (req, res) => {
  try {
    const cart = req.session.cart || [];
    if (cart.length === 0) return res.redirect('/cart');

    const { street, area, city, pincode, paymentMethod, couponCode, discount } = req.body;

    const subtotal = cart.reduce((t, i) => t + (i.price * i.qty), 0);
    const discountAmt = parseFloat(discount) || 0;
    const deliveryFee = parseFloat(req.body.deliveryFee) || 40;
    const taxes = Math.round(subtotal * 0.05);
    const totalAmount = subtotal - discountAmt + deliveryFee + taxes;

    const restaurantId = cart[0].restaurantId;
    const restaurantName = cart[0].restaurantName;

    const orderItems = cart.map(i => ({
      menuItem: i.itemId,
      restaurant: restaurantId,
      name: i.name,
      image: i.image,
      price: i.price,
      qty: i.qty,
      spiceLevel: i.spiceLevel || 'Medium',
      specialInstructions: i.specialInstructions || '',
      isVeg: i.isVeg
    }));

    const estimatedDelivery = new Date(Date.now() + 40 * 60 * 1000);

    const order = await Order.create({
      user: req.session.user._id,
      restaurant: restaurantId,
      restaurantName,
      items: orderItems,
      deliveryAddress: { street, area: area || '', city, pincode },
      subtotal,
      deliveryFee,
      taxes,
      discount: discountAmt,
      couponCode: couponCode || '',
      totalAmount,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
      orderStatus: 'Placed',
      statusHistory: [{ status: 'Placed', note: 'Order received successfully' }],
      estimatedDelivery
    });

    // Update restaurant order count
    await Restaurant.findByIdAndUpdate(restaurantId, { $inc: { totalOrders: 1 } });
    await User.findByIdAndUpdate(req.session.user._id, { $push: { recentOrders: order._id } });

    // Clear cart
    req.session.cart = [];

    res.redirect(`/order/${order._id}/success`);
  } catch (err) {
    console.error(err);
    res.redirect('/checkout');
  }
});

// Order success page
router.get('/order/:id/success', isAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order || order.user.toString() !== req.session.user._id.toString()) {
      return res.redirect('/');
    }
    res.render('pages/order-success', { title: 'Order Placed! | FOODORA', order });
  } catch (err) {
    res.redirect('/');
  }
});

// Order tracking
router.get('/order/:id/track', isAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('restaurant', 'name logo');
    if (!order || order.user.toString() !== req.session.user._id.toString()) {
      return res.redirect('/account');
    }
    res.render('pages/order-track', { title: 'Track Order | FOODORA', order });
  } catch (err) {
    res.redirect('/account');
  }
});

// My orders
router.get('/orders', isAuth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.session.user._id })
      .populate('restaurant', 'name logo').sort({ createdAt: -1 });
    res.render('pages/orders', { title: 'My Orders | FOODORA', orders });
  } catch (err) {
    res.redirect('/account');
  }
});

// Cancel order
router.post('/order/:id/cancel', isAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order || order.user.toString() !== req.session.user._id.toString()) {
      return res.json({ success: false });
    }
    if (['Delivered', 'Cancelled', 'Out for Delivery'].includes(order.orderStatus)) {
      return res.json({ success: false, msg: 'Cannot cancel this order.' });
    }
    order.orderStatus = 'Cancelled';
    order.statusHistory.push({ status: 'Cancelled', note: 'Cancelled by customer' });
    await order.save();
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false });
  }
});

// Reorder
router.post('/order/:id/reorder', isAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.json({ success: false });
    req.session.cart = order.items.map(i => ({
      key: `${i.menuItem}-${i.spiceLevel}-`,
      restaurantId: order.restaurant.toString(),
      restaurantName: order.restaurantName,
      itemId: i.menuItem ? i.menuItem.toString() : '',
      name: i.name,
      price: i.price,
      basePrice: i.price,
      image: i.image,
      isVeg: i.isVeg,
      addons: [],
      spiceLevel: i.spiceLevel || 'Medium',
      specialInstructions: '',
      qty: i.qty
    }));
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false });
  }
});

module.exports = router;
