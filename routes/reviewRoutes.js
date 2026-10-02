const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Restaurant = require('../models/Restaurant');
const { isAuth } = require('../middleware/auth');

// Submit review
router.post('/restaurant/:id/review', isAuth, async (req, res) => {
  try {
    const { rating, review, foodRating, deliveryRating, orderId } = req.body;

    // Check for existing review
    const existing = await Review.findOne({
      user: req.session.user._id,
      restaurant: req.params.id
    });
    if (existing) {
      req.session.flash = { type: 'error', msg: 'You have already reviewed this restaurant.' };
      return res.redirect(`/restaurant/${req.params.id}`);
    }

    await Review.create({
      user: req.session.user._id,
      restaurant: req.params.id,
      order: orderId || null,
      rating: parseFloat(rating),
      review: review || '',
      foodRating: foodRating ? parseFloat(foodRating) : undefined,
      deliveryRating: deliveryRating ? parseFloat(deliveryRating) : undefined,
      isVerified: !!orderId
    });

    // Recalculate restaurant rating
    const reviews = await Review.find({ restaurant: req.params.id });
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    await Restaurant.findByIdAndUpdate(req.params.id, {
      rating: Math.round(avg * 10) / 10,
      reviewCount: reviews.length
    });

    req.session.flash = { type: 'success', msg: 'Thank you for your review! ⭐' };
    res.redirect(`/restaurant/${req.params.id}`);
  } catch (err) {
    console.error(err);
    res.redirect(`/restaurant/${req.params.id}`);
  }
});

// Rate order
router.post('/order/:id/rate', isAuth, async (req, res) => {
  try {
    const { rating, review } = req.body;
    const Order = require('../models/Order');
    const order = await Order.findById(req.params.id);
    if (!order || order.user.toString() !== req.session.user._id.toString()) {
      return res.json({ success: false });
    }
    order.rating = parseFloat(rating);
    order.review = review || '';
    order.isRated = true;
    await order.save();
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false });
  }
});

module.exports = router;
