const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');
const Order = require('../models/Order');
const Review = require('../models/Review');

const restaurants = [
  {
    name: 'Spice Route',
    description: 'Authentic North Indian flavours crafted with generations-old recipes. Every dish tells a story of spice and tradition.',
    logo: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80',
    cuisine: ['North Indian', 'Mughlai', 'Punjabi'],
    categories: ['Biryani', 'Curries', 'Tandoor', 'Bread'],
    address: '12, MG Road, Koregaon Park',
    city: 'Pune', area: 'Koregaon Park', pincode: '411001',
    rating: 4.5, reviewCount: 1240, deliveryTime: '35-45 min',
    deliveryFee: 40, minOrder: 199, priceRange: '₹₹',
    isVeg: false, openingTime: '11:00', closingTime: '23:30',
    isOpen: true, isFeatured: true,
    offer: '20% OFF', offerValue: 20,
    menu: [
      { name: 'Butter Chicken', description: 'Creamy tomato-based curry with tender chicken pieces', price: 299, category: 'Main Course', isVeg: false, isBestseller: true, rating: 4.7, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80', addons: [{ name: 'Extra Gravy', price: 30 }, { name: 'Double Chicken', price: 80 }], spiceLevels: ['Mild', 'Medium', 'Spicy'] },
      { name: 'Dal Makhani', description: 'Slow-cooked black lentils in rich butter and cream', price: 199, category: 'Main Course', isVeg: true, isBestseller: true, rating: 4.6, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80', addons: [{ name: 'Extra Butter', price: 20 }], spiceLevels: ['Mild', 'Medium'] },
      { name: 'Chicken Biryani', description: 'Fragrant basmati rice cooked with spiced chicken and caramelized onions', price: 329, category: 'Biryani', isVeg: false, isBestseller: true, rating: 4.8, image: 'https://images.unsplash.com/photo-1563379091339-03246963d96e?w=400&q=80', addons: [{ name: 'Raita', price: 40 }, { name: 'Salan', price: 30 }], spiceLevels: ['Medium', 'Spicy'] },
      { name: 'Paneer Tikka', description: 'Soft paneer cubes marinated with aromatic spices, grilled to perfection', price: 249, category: 'Starters', isVeg: true, isBestseller: false, rating: 4.5, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80', addons: [{ name: 'Mint Chutney', price: 20 }, { name: 'Extra Paneer', price: 60 }], spiceLevels: ['Mild', 'Medium', 'Spicy', 'Extra Spicy'] },
      { name: 'Garlic Naan', description: 'Soft leavened bread baked in tandoor with garlic and butter', price: 59, category: 'Bread', isVeg: true, rating: 4.4, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80', addons: [{ name: 'Extra Butter', price: 15 }], spiceLevels: [] },
      { name: 'Gulab Jamun', description: 'Soft milk-solid dumplings soaked in rose-flavoured sugar syrup', price: 99, category: 'Desserts', isVeg: true, rating: 4.6, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80', addons: [], spiceLevels: [] },
      { name: 'Mango Lassi', description: 'Chilled yogurt blended with ripe Alphonso mango', price: 89, category: 'Beverages', isVeg: true, rating: 4.7, image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80', addons: [], spiceLevels: [] }
    ]
  },
  {
    name: 'Urban Tandoor',
    description: 'Modern Indian grill cuisine with a contemporary twist on age-old tandoor traditions.',
    logo: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=80',
    cuisine: ['North Indian', 'Tandoor'],
    categories: ['Starters', 'Main Course', 'Beverages'],
    address: '45, FC Road, Shivajinagar',
    city: 'Pune', area: 'Shivajinagar', pincode: '411005',
    rating: 4.6, reviewCount: 892, deliveryTime: '30-40 min',
    deliveryFee: 30, minOrder: 149, priceRange: '₹₹',
    isVeg: false, openingTime: '12:00', closingTime: '23:00',
    isOpen: true, isFeatured: true,
    offer: '15% OFF', offerValue: 15,
    menu: [
      { name: 'Seekh Kebab', description: 'Minced lamb mixed with spices grilled on skewers', price: 279, category: 'Starters', isVeg: false, isBestseller: true, rating: 4.7, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80', addons: [{ name: 'Extra Chutney', price: 20 }], spiceLevels: ['Medium', 'Spicy', 'Extra Spicy'] },
      { name: 'Tandoori Chicken', description: 'Half chicken marinated overnight in yogurt and spices, roasted in tandoor', price: 349, category: 'Starters', isVeg: false, isBestseller: true, rating: 4.8, image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&q=80', addons: [{ name: 'Extra Leg Piece', price: 90 }], spiceLevels: ['Mild', 'Medium', 'Spicy'] },
      { name: 'Kadai Paneer', description: 'Fresh paneer cooked with bell peppers in spiced tomato masala', price: 229, category: 'Main Course', isVeg: true, isBestseller: false, rating: 4.5, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80', addons: [{ name: 'Extra Paneer', price: 60 }], spiceLevels: ['Medium', 'Spicy'] },
      { name: 'Mutton Rogan Josh', description: 'Slow-cooked mutton in Kashmiri spices and tomato base', price: 399, category: 'Main Course', isVeg: false, isBestseller: true, rating: 4.6, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80', addons: [{ name: 'Extra Mutton', price: 100 }], spiceLevels: ['Medium', 'Spicy'] },
      { name: 'Jeera Rice', description: 'Fragrant basmati rice tempered with cumin and ghee', price: 99, category: 'Rice', isVeg: true, rating: 4.3, image: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=400&q=80', addons: [], spiceLevels: [] }
    ]
  },
  {
    name: 'The Burger Yard',
    description: 'Craft burgers made with premium ingredients. Hand-pressed patties, fresh buns baked daily.',
    logo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80',
    cuisine: ['American', 'Burgers', 'Fast Food'],
    categories: ['Burgers', 'Fries', 'Shakes', 'Combos'],
    address: '7, Baner Road, Balewadi',
    city: 'Pune', area: 'Baner', pincode: '411045',
    rating: 4.4, reviewCount: 2100, deliveryTime: '20-30 min',
    deliveryFee: 25, minOrder: 99, priceRange: '₹₹',
    isVeg: false, openingTime: '11:00', closingTime: '01:00',
    isOpen: true, isFeatured: true,
    offer: 'Buy 2 Get 1 Free', offerValue: 33,
    menu: [
      { name: 'Classic Smash Burger', description: 'Double smashed beef patty, American cheese, pickles, onion, special sauce', price: 279, category: 'Burgers', isVeg: false, isBestseller: true, rating: 4.8, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80', addons: [{ name: 'Extra Patty', price: 80 }, { name: 'Extra Cheese', price: 30 }, { name: 'Bacon Strip', price: 60 }], spiceLevels: ['Mild', 'Medium', 'Spicy'] },
      { name: 'Crispy Chicken Burger', description: 'Buttermilk-fried chicken, coleslaw, chipotle mayo', price: 249, category: 'Burgers', isVeg: false, isBestseller: true, rating: 4.7, image: 'https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?w=400&q=80', addons: [{ name: 'Extra Sauce', price: 20 }, { name: 'Jalapeños', price: 20 }], spiceLevels: ['Mild', 'Medium', 'Spicy', 'Extra Spicy'] },
      { name: 'Mushroom Swiss Burger', description: 'Sautéed mushrooms, Swiss cheese, truffle aioli on toasted brioche', price: 259, category: 'Burgers', isVeg: true, isBestseller: false, rating: 4.5, image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&q=80', addons: [{ name: 'Extra Mushrooms', price: 40 }], spiceLevels: ['Mild', 'Medium'] },
      { name: 'Loaded Fries', description: 'Crispy fries loaded with cheese sauce, jalapeños and ranch', price: 149, category: 'Fries', isVeg: true, isBestseller: true, rating: 4.6, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80', addons: [{ name: 'Extra Cheese', price: 30 }], spiceLevels: ['Mild', 'Spicy'] },
      { name: 'Oreo Shake', description: 'Thick milkshake blended with Oreos and vanilla ice cream', price: 179, category: 'Shakes', isVeg: true, rating: 4.7, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80', addons: [], spiceLevels: [] }
    ]
  },
  {
    name: 'Mumbai Bites',
    description: 'Authentic Mumbai street food delivered to your door. Vada pav, pav bhaji, bhel puri and more!',
    logo: 'https://images.unsplash.com/photo-1606491048802-8342506d7851?w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1606491048802-8342506d7851?w=800&q=80',
    cuisine: ['Street Food', 'Mumbai', 'Chaat'],
    categories: ['Chaat', 'Sandwiches', 'Drinks'],
    address: '23, Laxmi Road, Sadashiv Peth',
    city: 'Pune', area: 'Sadashiv Peth', pincode: '411030',
    rating: 4.3, reviewCount: 3400, deliveryTime: '25-35 min',
    deliveryFee: 20, minOrder: 79, priceRange: '₹',
    isVeg: true, openingTime: '09:00', closingTime: '22:00',
    isOpen: true, isFeatured: false,
    offer: 'Free Delivery', offerValue: 0,
    menu: [
      { name: 'Pav Bhaji', description: 'Spiced vegetable mash served with buttered soft buns and onion', price: 99, category: 'Chaat', isVeg: true, isBestseller: true, rating: 4.7, image: 'https://images.unsplash.com/photo-1606491048802-8342506d7851?w=400&q=80', addons: [{ name: 'Extra Butter', price: 15 }, { name: 'Extra Pav', price: 20 }], spiceLevels: ['Mild', 'Medium', 'Spicy'] },
      { name: 'Vada Pav', description: 'The iconic Mumbai street burger – spiced potato fritter in a soft bun', price: 39, category: 'Chaat', isVeg: true, isBestseller: true, rating: 4.6, image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&q=80', addons: [{ name: 'Fried Chilli', price: 10 }], spiceLevels: ['Medium', 'Spicy'] },
      { name: 'Bhel Puri', description: 'Puffed rice mixed with tamarind chutney, vegetables and sev', price: 69, category: 'Chaat', isVeg: true, isBestseller: false, rating: 4.5, image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80', addons: [{ name: 'Extra Sev', price: 10 }], spiceLevels: ['Mild', 'Medium', 'Spicy'] },
      { name: 'Mumbai Sandwich', description: 'Multi-layered sandwich with potato, beet, tomato, cucumber and green chutney', price: 79, category: 'Sandwiches', isVeg: true, isBestseller: true, rating: 4.4, image: 'https://images.unsplash.com/photo-1481070414801-51fd732d7184?w=400&q=80', addons: [{ name: 'Extra Cheese', price: 20 }], spiceLevels: ['Mild', 'Spicy'] },
      { name: 'Sugarcane Juice', description: 'Fresh sugarcane juice with ginger and lemon', price: 49, category: 'Drinks', isVeg: true, rating: 4.8, image: 'https://images.unsplash.com/photo-1622597467836-f3e6cafc4220?w=400&q=80', addons: [], spiceLevels: [] }
    ]
  },
  {
    name: 'Wok Republic',
    description: 'Pan-Asian wok cooking inspired by the street markets of Bangkok, Tokyo and Shanghai.',
    logo: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=800&q=80',
    cuisine: ['Chinese', 'Thai', 'Japanese', 'Asian'],
    categories: ['Noodles', 'Dim Sum', 'Fried Rice', 'Soups'],
    address: '78, Aundh Road, Near Westend',
    city: 'Pune', area: 'Aundh', pincode: '411007',
    rating: 4.5, reviewCount: 1680, deliveryTime: '30-40 min',
    deliveryFee: 35, minOrder: 149, priceRange: '₹₹',
    isVeg: false, openingTime: '12:00', closingTime: '23:30',
    isOpen: true, isFeatured: true,
    offer: '25% OFF on orders above ₹499', offerValue: 25,
    menu: [
      { name: 'Hakka Noodles', description: 'Stir-fried noodles with vegetables in savory soy sauce', price: 189, category: 'Noodles', isVeg: true, isBestseller: true, rating: 4.6, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80', addons: [{ name: 'Add Egg', price: 20 }, { name: 'Extra Noodles', price: 40 }], spiceLevels: ['Mild', 'Medium', 'Spicy'] },
      { name: 'Chicken Fried Rice', description: 'Wok-tossed jasmine rice with chicken, egg and vegetables', price: 199, category: 'Fried Rice', isVeg: false, isBestseller: true, rating: 4.7, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80', addons: [{ name: 'Double Chicken', price: 60 }], spiceLevels: ['Mild', 'Medium', 'Spicy'] },
      { name: 'Steamed Momos', description: '8 pcs steamed dumplings stuffed with minced chicken and herbs', price: 159, category: 'Dim Sum', isVeg: false, isBestseller: true, rating: 4.8, image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80', addons: [{ name: 'Spicy Sauce', price: 20 }], spiceLevels: ['Mild', 'Medium', 'Spicy'] },
      { name: 'Veg Manchurian Gravy', description: 'Fried veg balls in spicy, tangy Manchurian sauce', price: 179, category: 'Noodles', isVeg: true, isBestseller: false, rating: 4.5, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80', addons: [], spiceLevels: ['Medium', 'Spicy', 'Extra Spicy'] },
      { name: 'Tom Kha Soup', description: 'Thai coconut milk soup with galangal, lemongrass and mushrooms', price: 199, category: 'Soups', isVeg: true, rating: 4.6, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80', addons: [], spiceLevels: ['Mild', 'Medium'] }
    ]
  },
  {
    name: 'Pizza District',
    description: 'Wood-fired Neapolitan pizzas with artisanal toppings. Slow fermented dough, San Marzano tomatoes.',
    logo: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80',
    cuisine: ['Italian', 'Pizza', 'Pasta'],
    categories: ['Pizza', 'Pasta', 'Salads', 'Garlic Bread'],
    address: '15, Senapati Bapat Road, Opposite Hotel Ramee',
    city: 'Pune', area: 'Senapati Bapat Road', pincode: '411016',
    rating: 4.7, reviewCount: 2250, deliveryTime: '25-35 min',
    deliveryFee: 45, minOrder: 199, priceRange: '₹₹₹',
    isVeg: false, openingTime: '11:30', closingTime: '23:30',
    isOpen: true, isFeatured: true,
    offer: '30% OFF on first order', offerValue: 30,
    menu: [
      { name: 'Margherita Classica', description: 'San Marzano tomato, buffalo mozzarella, fresh basil, extra virgin olive oil', price: 349, category: 'Pizza', isVeg: true, isBestseller: true, rating: 4.8, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80', addons: [{ name: 'Extra Cheese', price: 60 }, { name: 'Thin Crust', price: 0 }], spiceLevels: [] },
      { name: 'BBQ Chicken Pizza', description: 'Smoky BBQ sauce, grilled chicken, caramelized onions, cheddar', price: 449, category: 'Pizza', isVeg: false, isBestseller: true, rating: 4.7, image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&q=80', addons: [{ name: 'Extra Chicken', price: 80 }, { name: 'Extra Cheese', price: 60 }], spiceLevels: ['Mild', 'Spicy'] },
      { name: 'Truffle Mushroom Pizza', description: 'Truffle cream base, mixed mushrooms, parmesan, arugula', price: 499, category: 'Pizza', isVeg: true, isBestseller: false, rating: 4.6, image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&q=80', addons: [{ name: 'Extra Truffle', price: 50 }], spiceLevels: [] },
      { name: 'Penne Arrabbiata', description: 'Penne in spicy tomato sauce with garlic and fresh basil', price: 299, category: 'Pasta', isVeg: true, isBestseller: false, rating: 4.4, image: 'https://images.unsplash.com/photo-1627286394572-6a6b4c1c8929?w=400&q=80', addons: [{ name: 'Add Chicken', price: 80 }], spiceLevels: ['Medium', 'Spicy'] },
      { name: 'Cheesy Garlic Bread', description: 'Toasted sourdough with garlic butter and melted mozzarella', price: 149, category: 'Garlic Bread', isVeg: true, isBestseller: true, rating: 4.7, image: 'https://images.unsplash.com/photo-1573140401552-3fab0b24306f?w=400&q=80', addons: [{ name: 'Extra Cheese', price: 30 }], spiceLevels: [] }
    ]
  },
  {
    name: 'Royal Biryani House',
    description: 'The city\'s most celebrated dum biryani. Slow-cooked in sealed handi for an unmatched aroma.',
    logo: 'https://images.unsplash.com/photo-1563379091339-03246963d96e?w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1563379091339-03246963d96e?w=800&q=80',
    cuisine: ['Hyderabadi', 'Biryani', 'Mughlai'],
    categories: ['Biryani', 'Kebabs', 'Desserts', 'Beverages'],
    address: '90, Camp, MG Road',
    city: 'Pune', area: 'Camp', pincode: '411001',
    rating: 4.8, reviewCount: 4200, deliveryTime: '40-50 min',
    deliveryFee: 50, minOrder: 249, priceRange: '₹₹',
    isVeg: false, openingTime: '11:00', closingTime: '00:00',
    isOpen: true, isFeatured: true,
    offer: '₹100 OFF on orders above ₹599', offerValue: 0,
    menu: [
      { name: 'Hyderabadi Chicken Biryani', description: 'Authentic dum biryani with premium chicken, saffron and caramelized onions', price: 379, category: 'Biryani', isVeg: false, isBestseller: true, rating: 4.9, image: 'https://images.unsplash.com/photo-1563379091339-03246963d96e?w=400&q=80', addons: [{ name: 'Raita', price: 40 }, { name: 'Mirchi ka Salan', price: 50 }, { name: 'Extra Chicken', price: 90 }], spiceLevels: ['Medium', 'Spicy'] },
      { name: 'Mutton Biryani', description: 'Tender mutton pieces slow-cooked with fragrant basmati rice', price: 449, category: 'Biryani', isVeg: false, isBestseller: true, rating: 4.8, image: 'https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?w=400&q=80', addons: [{ name: 'Raita', price: 40 }, { name: 'Extra Mutton', price: 120 }], spiceLevels: ['Medium', 'Spicy'] },
      { name: 'Veg Biryani', description: 'Seasonal vegetables and paneer cooked in dum style with whole spices', price: 249, category: 'Biryani', isVeg: true, isBestseller: false, rating: 4.5, image: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=400&q=80', addons: [{ name: 'Raita', price: 40 }], spiceLevels: ['Mild', 'Medium', 'Spicy'] },
      { name: 'Phirni', description: 'Set rice pudding flavoured with rosewater and garnished with pistachios', price: 129, category: 'Desserts', isVeg: true, rating: 4.7, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80', addons: [], spiceLevels: [] },
      { name: 'Shahi Tukda', description: 'Fried bread soaked in saffron-scented milk and rabri', price: 149, category: 'Desserts', isVeg: true, rating: 4.6, image: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=400&q=80', addons: [], spiceLevels: [] }
    ]
  },
  {
    name: 'The South Table',
    description: 'Authentic South Indian cuisine from Tamil Nadu, Kerala and Karnataka. Dosas, idlis and curries.',
    logo: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1630409351241-e90e7d9e346e?w=800&q=80',
    cuisine: ['South Indian', 'Tamil', 'Kerala'],
    categories: ['Dosa', 'Idli', 'Curries', 'Beverages'],
    address: '56, Law College Road, Erandwane',
    city: 'Pune', area: 'Erandwane', pincode: '411004',
    rating: 4.4, reviewCount: 1890, deliveryTime: '25-35 min',
    deliveryFee: 25, minOrder: 99, priceRange: '₹',
    isVeg: true, openingTime: '07:00', closingTime: '22:00',
    isOpen: true, isFeatured: false,
    offer: '', offerValue: 0,
    menu: [
      { name: 'Masala Dosa', description: 'Crispy rice crepe with spiced potato filling, served with sambar and chutneys', price: 129, category: 'Dosa', isVeg: true, isBestseller: true, rating: 4.7, image: 'https://images.unsplash.com/photo-1630409351241-e90e7d9e346e?w=400&q=80', addons: [{ name: 'Extra Ghee', price: 20 }, { name: 'Extra Sambar', price: 20 }], spiceLevels: ['Mild', 'Medium', 'Spicy'] },
      { name: 'Idli Sambar (4 pcs)', description: 'Steamed rice cakes served with lentil soup and coconut chutney', price: 89, category: 'Idli', isVeg: true, isBestseller: true, rating: 4.6, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80', addons: [{ name: 'Extra Idli', price: 30 }], spiceLevels: [] },
      { name: 'Kerala Fish Curry', description: 'Tangy fish curry with raw mango and coconut milk in Kerala spices', price: 259, category: 'Curries', isVeg: false, isBestseller: false, rating: 4.8, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80', addons: [], spiceLevels: ['Medium', 'Spicy'] },
      { name: 'Filter Coffee', description: 'Strong South Indian filter coffee served in traditional tumbler', price: 59, category: 'Beverages', isVeg: true, isBestseller: true, rating: 4.9, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80', addons: [], spiceLevels: [] }
    ]
  },
  {
    name: 'Sweet Cravings',
    description: 'Artisan desserts, pastries, cakes and confections crafted daily. Celebration cakes on request.',
    logo: 'https://images.unsplash.com/photo-1558636508-e0de1a85b769?w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80',
    cuisine: ['Desserts', 'Bakery', 'Pastry'],
    categories: ['Cakes', 'Pastries', 'Ice Cream', 'Chocolates'],
    address: '34, Viman Nagar, Near Phoenix Marketcity',
    city: 'Pune', area: 'Viman Nagar', pincode: '411014',
    rating: 4.6, reviewCount: 1100, deliveryTime: '20-30 min',
    deliveryFee: 30, minOrder: 149, priceRange: '₹₹',
    isVeg: true, openingTime: '10:00', closingTime: '23:00',
    isOpen: true, isFeatured: false,
    offer: '10% OFF', offerValue: 10,
    menu: [
      { name: 'Belgian Chocolate Truffle Cake', description: 'Dense dark chocolate cake with three layers of ganache frosting', price: 499, category: 'Cakes', isVeg: true, isBestseller: true, rating: 4.8, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80', addons: [{ name: 'Custom Message', price: 50 }, { name: 'Candles', price: 30 }], spiceLevels: [] },
      { name: 'Tiramisu', description: 'Classic Italian dessert with mascarpone, espresso-soaked ladyfingers', price: 229, category: 'Pastries', isVeg: true, isBestseller: true, rating: 4.7, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80', addons: [], spiceLevels: [] },
      { name: 'Mango Cheesecake', description: 'New York-style cheesecake with fresh Alphonso mango topping', price: 299, category: 'Pastries', isVeg: true, rating: 4.6, image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80', addons: [], spiceLevels: [] },
      { name: 'Nutella Waffle', description: 'Crispy Belgian waffle with Nutella, banana and whipped cream', price: 199, category: 'Pastries', isVeg: true, isBestseller: false, rating: 4.5, image: 'https://images.unsplash.com/photo-1558401391-7b1abb6c77d0?w=400&q=80', addons: [{ name: 'Scoop of Ice Cream', price: 60 }], spiceLevels: [] }
    ]
  },
  {
    name: 'Curry House',
    description: 'Contemporary Indian curries and breads with a refined dining experience delivered home.',
    logo: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80',
    cuisine: ['North Indian', 'Pan Indian'],
    categories: ['Curries', 'Bread', 'Rice', 'Beverages'],
    address: '8, Kothrud, Karve Road',
    city: 'Pune', area: 'Kothrud', pincode: '411038',
    rating: 4.3, reviewCount: 760, deliveryTime: '35-45 min',
    deliveryFee: 30, minOrder: 149, priceRange: '₹₹',
    isVeg: false, openingTime: '11:30', closingTime: '23:00',
    isOpen: true, isFeatured: false,
    offer: '', offerValue: 0,
    menu: [
      { name: 'Paneer Butter Masala', description: 'Fresh paneer in a creamy, mildly spiced tomato-cashew gravy', price: 229, category: 'Curries', isVeg: true, isBestseller: true, rating: 4.5, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80', addons: [{ name: 'Extra Gravy', price: 30 }], spiceLevels: ['Mild', 'Medium'] },
      { name: 'Chicken Tikka Masala', description: 'Grilled chicken in a rich, aromatic masala sauce', price: 289, category: 'Curries', isVeg: false, isBestseller: true, rating: 4.6, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80', addons: [{ name: 'Extra Chicken', price: 70 }], spiceLevels: ['Medium', 'Spicy'] },
      { name: 'Tandoori Roti', description: 'Whole wheat bread baked fresh in clay oven', price: 39, category: 'Bread', isVeg: true, rating: 4.3, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80', addons: [], spiceLevels: [] }
    ]
  },
  {
    name: 'Pasta Palacio',
    description: 'Italian pasta and risotto made from scratch. Fresh egg pasta, imported ingredients, authentic recipes.',
    logo: 'https://images.unsplash.com/photo-1627286394572-6a6b4c1c8929?w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1551183053-bf91798d105e?w=800&q=80',
    cuisine: ['Italian', 'Pasta', 'Mediterranean'],
    categories: ['Pasta', 'Risotto', 'Soups', 'Desserts'],
    address: '22, Koregaon Park, Lane 6',
    city: 'Pune', area: 'Koregaon Park', pincode: '411001',
    rating: 4.5, reviewCount: 890, deliveryTime: '30-40 min',
    deliveryFee: 40, minOrder: 199, priceRange: '₹₹₹',
    isVeg: false, openingTime: '12:00', closingTime: '23:00',
    isOpen: true, isFeatured: false,
    offer: '20% OFF on weekdays', offerValue: 20,
    menu: [
      { name: 'Cacio e Pepe', description: 'Roman classic – spaghetti with Pecorino Romano and black pepper', price: 329, category: 'Pasta', isVeg: true, isBestseller: true, rating: 4.7, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80', addons: [{ name: 'Add Bacon', price: 70 }], spiceLevels: ['Mild', 'Medium'] },
      { name: 'Seafood Linguine', description: 'Linguine with prawns, mussels, clams in white wine tomato sauce', price: 499, category: 'Pasta', isVeg: false, isBestseller: true, rating: 4.8, image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&q=80', addons: [{ name: 'Extra Seafood', price: 100 }], spiceLevels: ['Mild', 'Medium'] },
      { name: 'Mushroom Risotto', description: 'Arborio rice with porcini mushrooms, parmesan and truffle oil', price: 369, category: 'Risotto', isVeg: true, isBestseller: false, rating: 4.6, image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&q=80', addons: [{ name: 'Extra Truffle', price: 50 }], spiceLevels: [] }
    ]
  },
  {
    name: 'Rolls N Wraps',
    description: 'Kathi rolls, wraps and frankie rolls made fresh to order. Quick bites, big flavours.',
    logo: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800&q=80',
    cuisine: ['Rolls', 'Wraps', 'Street Food'],
    categories: ['Kathi Rolls', 'Wraps', 'Combo'],
    address: '67, Deccan Gymkhana, JM Road',
    city: 'Pune', area: 'Deccan', pincode: '411004',
    rating: 4.2, reviewCount: 1450, deliveryTime: '20-30 min',
    deliveryFee: 20, minOrder: 79, priceRange: '₹',
    isVeg: false, openingTime: '10:00', closingTime: '23:00',
    isOpen: true, isFeatured: false,
    offer: 'BOGO on rolls', offerValue: 0,
    menu: [
      { name: 'Egg Chicken Kathi Roll', description: 'Paratha wrapped with egg, spiced chicken tikka, onion and chutney', price: 129, category: 'Kathi Rolls', isVeg: false, isBestseller: true, rating: 4.5, image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400&q=80', addons: [{ name: 'Extra Egg', price: 20 }, { name: 'Extra Cheese', price: 25 }], spiceLevels: ['Mild', 'Medium', 'Spicy', 'Extra Spicy'] },
      { name: 'Paneer Tikka Roll', description: 'Flaky paratha with grilled paneer, onion rings and mint chutney', price: 119, category: 'Kathi Rolls', isVeg: true, isBestseller: true, rating: 4.4, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80', addons: [{ name: 'Extra Paneer', price: 40 }], spiceLevels: ['Medium', 'Spicy'] },
      { name: 'Mutton Shammi Roll', description: 'Tender mutton patty roll with pickled onions and yogurt', price: 169, category: 'Kathi Rolls', isVeg: false, isBestseller: false, rating: 4.6, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80', addons: [], spiceLevels: ['Medium', 'Spicy'] }
    ]
  },
  {
    name: 'Green Bowl',
    description: 'Healthy, clean eating with nutritious bowls, salads, smoothies and grain-based meals.',
    logo: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80',
    cuisine: ['Healthy', 'Salads', 'Vegan', 'Bowls'],
    categories: ['Bowls', 'Salads', 'Smoothies', 'Juices'],
    address: '11, Wakad, Hinjewadi Road',
    city: 'Pune', area: 'Wakad', pincode: '411057',
    rating: 4.5, reviewCount: 670, deliveryTime: '25-35 min',
    deliveryFee: 35, minOrder: 149, priceRange: '₹₹',
    isVeg: true, openingTime: '07:30', closingTime: '21:00',
    isOpen: true, isFeatured: false,
    offer: 'Free smoothie on orders above ₹399', offerValue: 0,
    menu: [
      { name: 'Poke Bowl', description: 'Brown rice, edamame, avocado, cucumber, sesame-marinated tofu', price: 299, category: 'Bowls', isVeg: true, isBestseller: true, rating: 4.7, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80', addons: [{ name: 'Extra Avocado', price: 40 }], spiceLevels: ['Mild', 'Medium'] },
      { name: 'Greek Salad', description: 'Tomatoes, olives, feta, cucumber, red onion with oregano dressing', price: 229, category: 'Salads', isVeg: true, isBestseller: false, rating: 4.5, image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80', addons: [{ name: 'Add Chicken', price: 60 }], spiceLevels: [] },
      { name: 'Green Protein Smoothie', description: 'Spinach, banana, almond milk, protein powder, chia seeds', price: 199, category: 'Smoothies', isVeg: true, isBestseller: true, rating: 4.6, image: 'https://images.unsplash.com/photo-1622597467836-f3e6cafc4220?w=400&q=80', addons: [], spiceLevels: [] }
    ]
  },
  {
    name: 'Sandwich Station',
    description: 'Gourmet sandwiches and subs made to order. Premium fillings, freshly baked bread.',
    logo: 'https://images.unsplash.com/photo-1481070414801-51fd732d7184?w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80',
    cuisine: ['Sandwiches', 'Subs', 'Wraps'],
    categories: ['Cold Subs', 'Hot Subs', 'Wraps', 'Beverages'],
    address: '3, Magarpatta City, Hadapsar',
    city: 'Pune', area: 'Hadapsar', pincode: '411028',
    rating: 4.1, reviewCount: 530, deliveryTime: '20-25 min',
    deliveryFee: 25, minOrder: 99, priceRange: '₹₹',
    isVeg: false, openingTime: '09:00', closingTime: '21:00',
    isOpen: true, isFeatured: false,
    offer: '15% OFF', offerValue: 15,
    menu: [
      { name: 'Italian BMT', description: 'Salami, pepperoni, ham on Italian bread with all the trimmings', price: 219, category: 'Cold Subs', isVeg: false, isBestseller: true, rating: 4.4, image: 'https://images.unsplash.com/photo-1481070414801-51fd732d7184?w=400&q=80', addons: [{ name: 'Extra Meat', price: 50 }, { name: 'Extra Cheese', price: 30 }], spiceLevels: ['Mild', 'Medium', 'Spicy'] },
      { name: 'Veggie Delite', description: 'Garden fresh vegetables with lettuce, onion, olives on multigrain', price: 159, category: 'Cold Subs', isVeg: true, isBestseller: false, rating: 4.2, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80', addons: [], spiceLevels: [] }
    ]
  },
  {
    name: 'The Waffle House',
    description: 'Belgian waffles, crepes and French toast with decadent toppings and gourmet syrups.',
    logo: 'https://images.unsplash.com/photo-1558401391-7b1abb6c77d0?w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1558401391-7b1abb6c77d0?w=800&q=80',
    cuisine: ['Waffles', 'Desserts', 'Breakfast'],
    categories: ['Waffles', 'Crepes', 'French Toast', 'Beverages'],
    address: '18, NIBM Road, Kondhwa',
    city: 'Pune', area: 'Kondhwa', pincode: '411048',
    rating: 4.4, reviewCount: 820, deliveryTime: '25-35 min',
    deliveryFee: 30, minOrder: 149, priceRange: '₹₹',
    isVeg: true, openingTime: '08:00', closingTime: '23:00',
    isOpen: true, isFeatured: false,
    offer: 'Free coffee with waffle', offerValue: 0,
    menu: [
      { name: 'Classic Butter Waffle', description: 'Crispy Belgian waffle with maple syrup, butter and berries', price: 179, category: 'Waffles', isVeg: true, isBestseller: true, rating: 4.6, image: 'https://images.unsplash.com/photo-1558401391-7b1abb6c77d0?w=400&q=80', addons: [{ name: 'Scoop of Ice Cream', price: 60 }, { name: 'Chocolate Sauce', price: 30 }], spiceLevels: [] },
      { name: 'Strawberry Crepe', description: 'Thin French crepe with strawberry compote and whipped cream', price: 159, category: 'Crepes', isVeg: true, isBestseller: false, rating: 4.5, image: 'https://images.unsplash.com/photo-1565299543923-37dd37887442?w=400&q=80', addons: [], spiceLevels: [] }
    ]
  },
  {
    name: 'NoodleNation',
    description: 'Authentic ramen, pho and noodle soups from across Asia. Rich broths simmered for hours.',
    logo: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80',
    cuisine: ['Japanese', 'Vietnamese', 'Korean', 'Noodles'],
    categories: ['Ramen', 'Pho', 'Rice Bowls', 'Sides'],
    address: '55, Baner, Pune Nagar Road',
    city: 'Pune', area: 'Baner', pincode: '411045',
    rating: 4.6, reviewCount: 1120, deliveryTime: '35-45 min',
    deliveryFee: 45, minOrder: 199, priceRange: '₹₹₹',
    isVeg: false, openingTime: '12:00', closingTime: '23:00',
    isOpen: true, isFeatured: true,
    offer: '', offerValue: 0,
    menu: [
      { name: 'Tonkotsu Ramen', description: 'Rich pork bone broth with chashu pork, soft egg, nori and bamboo shoots', price: 429, category: 'Ramen', isVeg: false, isBestseller: true, rating: 4.8, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80', addons: [{ name: 'Extra Chashu', price: 80 }, { name: 'Extra Egg', price: 30 }], spiceLevels: ['Mild', 'Spicy'] },
      { name: 'Spicy Chicken Ramen', description: 'Chicken broth with spicy tare, grilled chicken and scallions', price: 369, category: 'Ramen', isVeg: false, isBestseller: true, rating: 4.7, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80', addons: [], spiceLevels: ['Medium', 'Spicy', 'Extra Spicy'] },
      { name: 'Miso Veg Ramen', description: 'White miso broth with tofu, mushrooms and bok choy', price: 329, category: 'Ramen', isVeg: true, rating: 4.5, image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80', addons: [], spiceLevels: ['Mild', 'Medium'] }
    ]
  },
  {
    name: 'Ice Creamery Co.',
    description: 'Artisan ice creams, sorbets and gelatos made in small batches with natural flavours.',
    logo: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=800&q=80',
    cuisine: ['Ice Cream', 'Desserts', 'Gelato'],
    categories: ['Ice Cream', 'Scoops', 'Sundaes', 'Shakes'],
    address: '9, Kalyani Nagar, Near Inorbit Mall',
    city: 'Pune', area: 'Kalyani Nagar', pincode: '411006',
    rating: 4.5, reviewCount: 950, deliveryTime: '20-30 min',
    deliveryFee: 25, minOrder: 99, priceRange: '₹₹',
    isVeg: true, openingTime: '12:00', closingTime: '00:00',
    isOpen: true, isFeatured: false,
    offer: '2 scoops + 1 free', offerValue: 0,
    menu: [
      { name: 'Salted Caramel Gelato', description: 'Velvety Italian-style gelato with salted caramel ribbons', price: 149, category: 'Ice Cream', isVeg: true, isBestseller: true, rating: 4.8, image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&q=80', addons: [{ name: 'Extra Scoop', price: 80 }, { name: 'Waffle Cone', price: 30 }], spiceLevels: [] },
      { name: 'Mango Sorbet', description: 'Refreshing pure mango sorbet with no added dairy', price: 129, category: 'Scoops', isVeg: true, rating: 4.7, image: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=400&q=80', addons: [], spiceLevels: [] },
      { name: 'Choco Brownie Sundae', description: 'Warm brownie topped with vanilla ice cream, hot fudge and nuts', price: 249, category: 'Sundaes', isVeg: true, isBestseller: true, rating: 4.9, image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80', addons: [{ name: 'Extra Fudge', price: 30 }], spiceLevels: [] }
    ]
  },
  {
    name: 'Tandoori Nights',
    description: 'An evening experience of North Indian delicacies cooked over live charcoal.',
    logo: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?w=800&q=80',
    cuisine: ['North Indian', 'Tandoor', 'BBQ'],
    categories: ['Kebabs', 'Tikka', 'Curries', 'Naan'],
    address: '31, Pimple Saudagar, Wakad',
    city: 'Pune', area: 'Pimple Saudagar', pincode: '411027',
    rating: 4.3, reviewCount: 620, deliveryTime: '40-50 min',
    deliveryFee: 35, minOrder: 199, priceRange: '₹₹',
    isVeg: false, openingTime: '18:00', closingTime: '02:00',
    isOpen: true, isFeatured: false,
    offer: '', offerValue: 0,
    menu: [
      { name: 'Mixed Grill Platter', description: 'An assortment of chicken tikka, seekh kebab, paneer tikka and prawns', price: 599, category: 'Kebabs', isVeg: false, isBestseller: true, rating: 4.7, image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&q=80', addons: [{ name: 'Extra Chutney', price: 20 }], spiceLevels: ['Medium', 'Spicy'] },
      { name: 'Chicken Tikka', description: '6 pcs boneless chicken marinated in hung curd and spices, char-grilled', price: 299, category: 'Tikka', isVeg: false, isBestseller: false, rating: 4.5, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80', addons: [], spiceLevels: ['Mild', 'Medium', 'Spicy', 'Extra Spicy'] }
    ]
  },
  {
    name: 'Sushi Sakura',
    description: 'Authentic Japanese sushi and sashimi prepared by trained sushi chefs. Premium fish, premium experience.',
    logo: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&q=80',
    cuisine: ['Japanese', 'Sushi', 'Asian'],
    categories: ['Nigiri', 'Maki Rolls', 'Sashimi', 'Ramen'],
    address: '42, Boat Club Road, Dhole Patil',
    city: 'Pune', area: 'Dhole Patil Road', pincode: '411001',
    rating: 4.7, reviewCount: 780, deliveryTime: '40-50 min',
    deliveryFee: 60, minOrder: 349, priceRange: '₹₹₹₹',
    isVeg: false, openingTime: '12:00', closingTime: '23:00',
    isOpen: true, isFeatured: true,
    offer: '', offerValue: 0,
    menu: [
      { name: 'Dragon Roll', description: '8 pcs California roll topped with avocado, spicy mayo and tobiko', price: 499, category: 'Maki Rolls', isVeg: false, isBestseller: true, rating: 4.8, image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&q=80', addons: [{ name: 'Extra Wasabi', price: 20 }], spiceLevels: ['Mild', 'Spicy'] },
      { name: 'Salmon Sashimi (6 pcs)', description: 'Fresh Norwegian salmon, thinly sliced, served with soy and ginger', price: 549, category: 'Sashimi', isVeg: false, isBestseller: true, rating: 4.9, image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400&q=80', addons: [], spiceLevels: [] },
      { name: 'Avocado Maki (6 pcs)', description: 'Fresh avocado wrapped in seasoned rice and nori', price: 249, category: 'Maki Rolls', isVeg: true, rating: 4.5, image: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400&q=80', addons: [], spiceLevels: [] }
    ]
  },
  {
    name: 'Taco Loco',
    description: 'Mexican street tacos, burritos, quesadillas and nachos. Fresh salsas made daily.',
    logo: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80',
    cuisine: ['Mexican', 'Tex-Mex', 'Latin'],
    categories: ['Tacos', 'Burritos', 'Quesadillas', 'Nachos'],
    address: '5, Viman Nagar, Clover Center',
    city: 'Pune', area: 'Viman Nagar', pincode: '411014',
    rating: 4.4, reviewCount: 1350, deliveryTime: '25-35 min',
    deliveryFee: 30, minOrder: 149, priceRange: '₹₹',
    isVeg: false, openingTime: '11:00', closingTime: '23:00',
    isOpen: true, isFeatured: false,
    offer: 'Taco Tuesday: 3 for ₹299', offerValue: 0,
    menu: [
      { name: 'Chicken Tacos (2 pcs)', description: 'Grilled chicken, pico de gallo, guacamole in soft corn tortilla', price: 229, category: 'Tacos', isVeg: false, isBestseller: true, rating: 4.6, image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80', addons: [{ name: 'Extra Guacamole', price: 40 }, { name: 'Sour Cream', price: 30 }], spiceLevels: ['Mild', 'Medium', 'Spicy'] },
      { name: 'Bean & Cheese Quesadilla', description: 'Crispy flour tortilla filled with refried beans, cheddar and jalapeños', price: 199, category: 'Quesadillas', isVeg: true, isBestseller: false, rating: 4.4, image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=400&q=80', addons: [{ name: 'Sour Cream', price: 30 }], spiceLevels: ['Mild', 'Spicy'] },
      { name: 'Loaded Nachos', description: 'Tortilla chips with cheese sauce, jalapeños, salsa and guacamole', price: 249, category: 'Nachos', isVeg: true, isBestseller: true, rating: 4.7, image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&q=80', addons: [{ name: 'Extra Guacamole', price: 40 }, { name: 'Add Chicken', price: 60 }], spiceLevels: ['Mild', 'Medium', 'Extra Spicy'] }
    ]
  },
  {
    name: 'Breakfast Republic',
    description: 'All-day breakfast favourites – eggs, pancakes, waffles, French toast and classic brunches.',
    logo: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&q=80',
    cuisine: ['Breakfast', 'Brunch', 'Continental'],
    categories: ['Eggs', 'Pancakes', 'Toast', 'Beverages'],
    address: '1, Aundh, DP Road',
    city: 'Pune', area: 'Aundh', pincode: '411007',
    rating: 4.5, reviewCount: 1680, deliveryTime: '20-30 min',
    deliveryFee: 30, minOrder: 149, priceRange: '₹₹',
    isVeg: false, openingTime: '07:00', closingTime: '16:00',
    isOpen: true, isFeatured: false,
    offer: 'Free coffee with breakfast', offerValue: 0,
    menu: [
      { name: 'Eggs Benedict', description: 'Poached eggs on toasted English muffin with Canadian bacon and hollandaise', price: 299, category: 'Eggs', isVeg: false, isBestseller: true, rating: 4.7, image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&q=80', addons: [{ name: 'Extra Egg', price: 30 }], spiceLevels: [] },
      { name: 'Fluffy Pancakes (Stack of 3)', description: 'Buttermilk pancakes served with maple syrup, butter and fresh berries', price: 249, category: 'Pancakes', isVeg: true, isBestseller: true, rating: 4.8, image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=400&q=80', addons: [{ name: 'Banana Slices', price: 30 }, { name: 'Whipped Cream', price: 30 }], spiceLevels: [] },
      { name: 'Americano', description: 'Bold double shot espresso with hot water', price: 89, category: 'Beverages', isVeg: true, rating: 4.6, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80', addons: [], spiceLevels: [] }
    ]
  }
];

const seedDatabase = async () => {
  try {
    console.log('[SEED] Starting database seeding...');

    // Clear existing data
    await Restaurant.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});
    console.log('[SEED] Cleared existing data.');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@foodora.com',
      password: 'admin123',
      role: 'admin',
      phone: '9999999999',
      location: { city: 'Pune', area: 'Koregaon Park', pincode: '411001' }
    });

    // Create demo customer
    const customer = await User.create({
      name: 'Rahul Sharma',
      email: 'user@foodora.com',
      password: 'user123',
      role: 'customer',
      phone: '9876543210',
      location: { city: 'Pune', area: 'Baner', pincode: '411045' },
      addresses: [{
        label: 'Home',
        street: '12, Aster Society, Baner Road',
        area: 'Baner',
        city: 'Pune',
        pincode: '411045',
        isDefault: true
      }]
    });

    // Create restaurant owners
    const owner1 = await User.create({
      name: 'Ramesh Gupta',
      email: 'owner@foodora.com',
      password: 'owner123',
      role: 'restaurant_owner',
      phone: '9988776655'
    });

    // Insert restaurants
    const createdRestaurants = await Restaurant.insertMany(
      restaurants.map((r, i) => ({ ...r, owner: i === 0 ? owner1._id : admin._id }))
    );
    console.log(`[SEED] Created ${createdRestaurants.length} restaurants.`);

    // Create demo reviews
    const reviewsData = createdRestaurants.slice(0, 5).map(r => ({
      user: customer._id,
      restaurant: r._id,
      rating: (4 + Math.random()).toFixed(1) * 1,
      review: 'Amazing food and quick delivery! Would definitely order again.',
      foodRating: 5,
      deliveryRating: 4,
      isVerified: true
    }));
    await Review.insertMany(reviewsData);

    // Create demo order
    const firstRestaurant = createdRestaurants[0];
    const firstItem = firstRestaurant.menu[0];
    const order = await Order.create({
      user: customer._id,
      restaurant: firstRestaurant._id,
      restaurantName: firstRestaurant.name,
      items: [{
        menuItem: firstItem._id,
        restaurant: firstRestaurant._id,
        name: firstItem.name,
        image: firstItem.image,
        price: firstItem.price,
        qty: 2,
        spiceLevel: 'Medium',
        isVeg: firstItem.isVeg
      }],
      deliveryAddress: {
        street: '12, Aster Society, Baner Road',
        area: 'Baner',
        city: 'Pune',
        pincode: '411045'
      },
      subtotal: firstItem.price * 2,
      deliveryFee: firstRestaurant.deliveryFee,
      taxes: Math.round(firstItem.price * 2 * 0.05),
      totalAmount: (firstItem.price * 2) + firstRestaurant.deliveryFee + Math.round(firstItem.price * 2 * 0.05),
      paymentMethod: 'Cash on Delivery',
      orderStatus: 'Delivered',
      statusHistory: [
        { status: 'Placed', note: 'Order received' },
        { status: 'Confirmed', note: 'Restaurant confirmed' },
        { status: 'Preparing', note: 'Being prepared' },
        { status: 'Delivered', note: 'Delivered successfully' }
      ],
      isRated: true,
      rating: 5
    });

    // Add order to customer favorites
    await User.findByIdAndUpdate(customer._id, {
      $push: { favorites: firstRestaurant._id, recentOrders: order._id }
    });

    console.log(`
    ✅ FOODORA Database Seeded Successfully!
    
    🔑 Login Credentials:
       Admin:           admin@foodora.com / admin123
       Customer:        user@foodora.com  / user123
       Restaurant Owner: owner@foodora.com / owner123
    
    🍕 ${createdRestaurants.length} restaurants with full menus created!
    `);
  } catch (err) {
    console.error('[SEED] Error:', err);
    throw err;
  }
};

module.exports = seedDatabase;
