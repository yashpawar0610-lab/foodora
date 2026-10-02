const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  name: { type: String, required: true },
  image: { type: String, default: '' },
  price: { type: Number, required: true },
  qty: { type: Number, required: true, default: 1 },
  addons: [{ name: String, price: Number }],
  spiceLevel: { type: String, default: 'Medium' },
  specialInstructions: { type: String, default: '' },
  isVeg: { type: Boolean, default: true }
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  restaurantName: { type: String, required: true },
  items: [orderItemSchema],
  deliveryAddress: {
    street: { type: String, required: true },
    area: { type: String, default: '' },
    city: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  subtotal: { type: Number, required: true, default: 0 },
  deliveryFee: { type: Number, default: 30 },
  taxes: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  couponCode: { type: String, default: '' },
  totalAmount: { type: Number, required: true, default: 0 },
  paymentMethod: {
    type: String,
    enum: ['Cash on Delivery', 'UPI', 'Card', 'Wallet'],
    default: 'Cash on Delivery'
  },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed', 'Refunded'], default: 'Pending' },
  orderStatus: {
    type: String,
    enum: ['Placed', 'Confirmed', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Placed'
  },
  statusHistory: [{
    status: String,
    time: { type: Date, default: Date.now },
    note: String
  }],
  estimatedDelivery: { type: Date },
  deliveredAt: { type: Date },
  orderNumber: { type: String, unique: true },
  isRated: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  review: { type: String, default: '' }
}, { timestamps: true });

// Auto-generate order number before saving
orderSchema.pre('save', function () {
  if (!this.orderNumber) {
    this.orderNumber = 'FDR' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 100);
  }
});

module.exports = mongoose.model('Order', orderSchema);
