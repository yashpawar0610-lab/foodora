const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

// Home page
router.get('/', async (req, res) => {
  try {
    const featuredRestaurants = await Restaurant.find({ isFeatured: true, isActive: true })
      .limit(8).sort({ rating: -1 });
    const allRestaurants = await Restaurant.find({ isActive: true })
      .limit(16).sort({ rating: -1 });
    const topRated = await Restaurant.find({ isActive: true, rating: { $gte: 4.5 } })
      .limit(8).sort({ rating: -1 });

    const categories = [
      { name: 'Pizza', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&q=80', slug: 'pizza' },
      { name: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80', slug: 'burgers' },
      { name: 'Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03246963d96e?w=200&q=80', slug: 'biryani' },
      { name: 'Chinese', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&q=80', slug: 'chinese' },
      { name: 'South Indian', image: 'https://images.unsplash.com/photo-1630409351241-e90e7d9e346e?w=200&q=80', slug: 'south indian' },
      { name: 'North Indian', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&q=80', slug: 'north indian' },
      { name: 'Rolls', image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=200&q=80', slug: 'rolls' },
      { name: 'Sandwich', image: 'https://images.unsplash.com/photo-1481070414801-51fd732d7184?w=200&q=80', slug: 'sandwiches' },
      { name: 'Pasta', image: 'https://images.unsplash.com/photo-1627286394572-6a6b4c1c8929?w=200&q=80', slug: 'pasta' },
      { name: 'Desserts', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&q=80', slug: 'desserts' },
      { name: 'Ice Cream', image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=200&q=80', slug: 'ice cream' },
      { name: 'Healthy', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&q=80', slug: 'healthy' },
      { name: 'Street Food', image: 'https://images.unsplash.com/photo-1606491048802-8342506d7851?w=200&q=80', slug: 'street food' },
      { name: 'Beverages', image: 'https://images.unsplash.com/photo-1622597467836-f3e6cafc4220?w=200&q=80', slug: 'beverages' },
      { name: 'Sushi', image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=200&q=80', slug: 'japanese' }
    ];

    const offers = [
      { code: 'FIRST50', desc: '50% OFF on your first order up to ₹100', minOrder: 199 },
      { code: 'HUNGRY20', desc: '20% OFF on orders above ₹399', minOrder: 399 },
      { code: 'FREEDEL', desc: 'FREE delivery on orders above ₹299', minOrder: 299 },
      { code: 'WEEKEND30', desc: '30% OFF every weekend', minOrder: 499 }
    ];

    res.render('pages/home', {
      title: 'FOODORA - Good Food. Great Moments.',
      featuredRestaurants,
      allRestaurants,
      topRated,
      categories,
      offers
    });
  } catch (err) {
    console.error(err);
    res.render('pages/home', {
      title: 'FOODORA - Good Food. Great Moments.',
      featuredRestaurants: [], allRestaurants: [], topRated: [],
      categories: [], offers: []
    });
  }
});

// Set location
router.post('/set-location', (req, res) => {
  const { city, area, pincode } = req.body;
  req.session.location = { city: city || 'Pune', area: area || '', pincode: pincode || '' };
  res.json({ success: true, location: req.session.location });
});

// About page
router.get('/about', (req, res) => {
  res.render('pages/about', { title: 'About FOODORA' });
});

// Contact page
router.get('/contact', (req, res) => {
  res.render('pages/contact', { title: 'Contact Us | FOODORA' });
});

// Offers page
router.get('/offers', async (req, res) => {
  const restaurants = await Restaurant.find({ isActive: true, offerValue: { $gt: 0 } }).sort({ offerValue: -1 });
  const coupons = [
    { code: 'FIRST50', desc: '50% OFF on first order (up to ₹100)', minOrder: 199, discount: 50, type: 'percent' },
    { code: 'HUNGRY20', desc: '20% OFF on orders above ₹399', minOrder: 399, discount: 20, type: 'percent' },
    { code: 'FREEDEL', desc: 'Free delivery on orders above ₹299', minOrder: 299, discount: 0, type: 'free_delivery' },
    { code: 'WEEKEND30', desc: '30% OFF every weekend', minOrder: 499, discount: 30, type: 'percent' },
    { code: 'SAVE100', desc: 'Flat ₹100 OFF on orders above ₹599', minOrder: 599, discount: 100, type: 'flat' },
    { code: 'NEWBIE', desc: '₹75 OFF for new users on orders above ₹249', minOrder: 249, discount: 75, type: 'flat' }
  ];
  res.render('pages/offers', { title: 'Offers & Coupons | FOODORA', restaurants, coupons });
});

module.exports = router;
