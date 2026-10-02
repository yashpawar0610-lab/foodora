const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

// Global search
router.get('/search', async (req, res) => {
  try {
    const { q, city } = req.query;
    if (!q || q.trim().length < 2) {
      return res.render('pages/search', {
        title: 'Search | FOODORA',
        results: [], foodResults: [], query: q || ''
      });
    }

    const regex = new RegExp(q, 'i');
    const query = { isActive: true };
    if (city) query.city = new RegExp(city, 'i');

    // Search restaurants by name, cuisine, area
    const restaurants = await Restaurant.find({
      ...query,
      $or: [{ name: regex }, { cuisine: regex }, { area: regex }, { description: regex }]
    }).limit(20);

    // Search within menus
    const allRestaurants = await Restaurant.find(query);
    const foodResults = [];
    allRestaurants.forEach(r => {
      r.menu.forEach(item => {
        if (regex.test(item.name) || regex.test(item.description) || regex.test(item.category)) {
          foodResults.push({ ...item.toObject(), restaurantId: r._id, restaurantName: r.name });
        }
      });
    });

    res.render('pages/search', {
      title: `Search: "${q}" | FOODORA`,
      results: restaurants,
      foodResults: foodResults.slice(0, 20),
      query: q
    });
  } catch (err) {
    console.error(err);
    res.render('pages/search', { title: 'Search | FOODORA', results: [], foodResults: [], query: '' });
  }
});

// AJAX search suggestions
router.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) return res.json([]);
    const regex = new RegExp(q, 'i');
    const restaurants = await Restaurant.find({
      isActive: true,
      $or: [{ name: regex }, { cuisine: regex }]
    }).limit(5).select('name cuisine area rating deliveryTime');

    const suggestions = restaurants.map(r => ({
      type: 'restaurant',
      id: r._id,
      name: r.name,
      sub: r.cuisine.join(', '),
      area: r.area,
      rating: r.rating
    }));
    res.json(suggestions);
  } catch (err) {
    res.json([]);
  }
});

module.exports = router;
