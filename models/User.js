const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
  label: { type: String, default: 'Home' },
  street: { type: String, required: true },
  area: { type: String, default: '' },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  phone: { type: String, default: '' },
  avatar: { type: String, default: '' },
  role: {
    type: String,
    enum: ['customer', 'restaurant_owner', 'delivery_agent', 'admin'],
    default: 'customer'
  },
  addresses: [addressSchema],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }],
  recentOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  location: {
    city: { type: String, default: '' },
    area: { type: String, default: '' },
    pincode: { type: String, default: '' }
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
