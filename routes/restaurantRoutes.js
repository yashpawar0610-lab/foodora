const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const Review = require('../models/Review');
const User = require('../models/User');

// List all restaurants with filters
router.get('/restaurants', async (req, res) => {
  try {
    const { city, area, cuisine, veg, sort, offer, search } = req.query;
    const query = { isActive: true };

    if (city) query.city = new RegExp(city, 'i');
    if (area) query.area = new RegExp(area, 'i');
    if (cuisine) query.cuisine = new RegExp(cuisine, 'i');
    if (veg === 'true') query.isVeg = true;
    if (offer === 'true') query.offerValue = { $gt: 0 };
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { cuisine: new RegExp(search, 'i') },
        { area: new RegExp(search, 'i') }
      ];
    }

    let sortOption = { rating: -1 };
    if (sort === 'delivery_time') sortOption = { deliveryTime: 1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'min_order') sortOption = { minOrder: 1 };

    const restaurants = await Restaurant.find(query).sort(sortOption);

    const cuisineList = ['North Indian', 'South Indian', 'Chinese', 'Italian', 'American',
      'Biryani', 'Street Food', 'Healthy', 'Desserts', 'Japanese'];

    res.render('pages/restaurants', {
      title: 'Restaurants | FOODORA',
      restaurants,
      cuisineList,
      filters: req.query
    });
  } catch (err) {
    console.error(err);
    res.render('pages/restaurants', { title: 'Restaurants | FOODORA', restaurants: [], cuisineList: [], filters: {} });
  }
});

// Single restaurant page
router.get('/restaurant/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.redirect('/restaurants');

    const reviews = await Review.find({ restaurant: req.params.id })
      .populate('user', 'name avatar').sort({ createdAt: -1 }).limit(10);

    let isFavorited = false;
    if (req.session.user) {
      const user = await User.findById(req.session.user._id);
      isFavorited = user.favorites.some(f => f.toString() === req.params.id);
    }

    // Group menu by category
    const menuByCategory = {};
    restaurant.menu.forEach(item => {
      if (!menuByCategory[item.category]) menuByCategory[item.category] = [];
      menuByCategory[item.category].push(item);
    });

    res.render('pages/restaurant', {
      title: `${restaurant.name} | FOODORA`,
      restaurant,
      reviews,
      menuByCategory,
      isFavorited
    });
  } catch (err) {
    console.error(err);
    res.redirect('/restaurants');
  }
});

// Browse by category
router.get('/category/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const restaurants = await Restaurant.find({
      isActive: true,
      $or: [
        { cuisine: new RegExp(slug, 'i') },
        { categories: new RegExp(slug, 'i') },
        { 'menu.category': new RegExp(slug, 'i') }
      ]
    }).sort({ rating: -1 });

    res.render('pages/restaurants', {
      title: `${slug} Restaurants | FOODORA`,
      restaurants,
      cuisineList: [],
      filters: { cuisine: slug },
      categoryTitle: slug.charAt(0).toUpperCase() + slug.slice(1)
    });
  } catch (err) {
    res.redirect('/restaurants');
  }
});

// Get menu item details (AJAX for modal)
router.get('/restaurant/:id/item/:itemId', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    const item = restaurant.menu.id(req.params.itemId);
    if (!item) return res.json({ success: false });
    res.json({ success: true, item, restaurantName: restaurant.name, restaurantId: restaurant._id });
  } catch (err) {
    res.json({ success: false });
  }
});

module.exports = router;
