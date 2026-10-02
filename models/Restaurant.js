const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  image: { type: String, default: '' },
  category: { type: String, required: true },
  isVeg: { type: Boolean, default: true },
  isBestseller: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  addons: [{
    name: String,
    price: Number
  }],
  spiceLevels: [{ type: String }],
  tags: [String]
});

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  logo: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  cuisine: [{ type: String }],
  categories: [{ type: String }],
  address: { type: String, required: true },
  city: { type: String, required: true },
  area: { type: String, default: '' },
  pincode: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  deliveryTime: { type: String, default: '30-40 min' },
  deliveryFee: { type: Number, default: 30 },
  minOrder: { type: Number, default: 99 },
  priceRange: { type: String, enum: ['₹', '₹₹', '₹₹₹', '₹₹₹₹'], default: '₹₹' },
  isVeg: { type: Boolean, default: false },
  openingTime: { type: String, default: '10:00' },
  closingTime: { type: String, default: '23:00' },
  isOpen: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  offer: { type: String, default: '' },
  offerValue: { type: Number, default: 0 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  menu: [menuItemSchema],
  totalOrders: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
