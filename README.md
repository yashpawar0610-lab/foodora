# 🍕 FOODORA — Full-Stack Food Delivery & Restaurant Discovery Platform

A modern, high-performance food delivery and restaurant discovery web platform built with Node.js, Express, EJS, and MongoDB.

---

## 🌟 Key Features

### 🛒 Customer Discovery & Ordering
* **Dynamic Homepage**: Hero banner with live delivery stats, category carousels, promo discount vouchers, and curated restaurant lists.
* **Instant Search & Autocomplete**: Real-time debounce dropdown search for dishes and restaurants (`/api/search`).
* **Restaurant Filtering**: Filter by cuisine, vegetarian-only, offers, and sort by rating or delivery time.
* **Menu Customization**: Portion sizes, spice levels (*Mild, Medium, Spicy*), add-ons & extra toppings, and custom chef instructions.
* **Interactive Cart & Coupons**: Persistent session cart, sliding drawer, quantity modifiers, tax/delivery calculation, and promo codes (`FIRST50`, `HUNGRY20`, `FREEDEL`, `WEEKEND30`, `SAVE100`, `NEWBIE`).
* **Checkout & Address Manager**: Multi-address selector and payment methods (Cash on Delivery, UPI, Card, Wallet).
* **Live Order Tracking**: Visual 5-step order timeline (*Placed → Confirmed → Preparing → Ready → Out for Delivery → Delivered*) with status history and reorder CTA.
* **Ratings & Reviews**: Post star ratings and reviews on completed deliveries.
* **Favorites System**: Bookmark favourite kitchens with instant AJAX heart toggles.

### 🍽️ Restaurant Owner Dashboard (`/owner/dashboard`)
* Overview metrics: total orders, gross sales revenue, average kitchen rating, and active dish count.
* Live incoming order manager with status progression controls.
* Menu catalog management with one-click **Available / Sold Out** toggles.
* Add dish modal form with category, price, and dietary tags.

### 👑 Admin Management Portal (`/admin`)
* Analytics overview: system-wide orders, registered users, total platform volume.
* Restaurant controls: activate, deactivate, and monitor restaurants.
* Order monitoring: live order table with status filtering.
* Customer & merchant accounts management.
* Review moderation: rating oversight and review deletion.

---

## 🛠️ Tech Stack

* **Backend**: Node.js, Express.js
* **Templating**: EJS with `express-ejs-layouts`
* **Database**: MongoDB with Mongoose (with automated fallback to `mongodb-memory-server` if no local database daemon is running)
* **Authentication**: Express Session, Bcrypt.js
* **Styling**: Vanilla CSS3 (Custom Design System, CSS Variables, Responsive Grid & Flexbox)
* **Icons**: Remix Icon

---

## 🚀 Getting Started

### 1. Prerequisites
* [Node.js](https://nodejs.org/) (v16 or higher)
* [Git](https://git-scm.com/)

### 2. Installation
```bash
git clone https://github.com/yashpawar0610-lab/foodora.git
cd foodora
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
PORT=3001
MONGODB_URI=mongodb://127.0.0.1:27017/foodora_db
SESSION_SECRET=foodora_secret_key_2026_delivery_platform
NODE_ENV=development
```
*(Note: If MongoDB is not running locally, FOODORA automatically falls back to an in-memory database and auto-seeds all data seamlessly!)*

### 4. Run the Platform
```bash
npm start
```
Visit **`http://localhost:3001`** in your browser.

---

## 👥 Demo Accounts

| Role | Email | Password | Access URL |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@foodora.com` | `admin123` | `/admin` |
| **Restaurant Owner** | `owner@foodora.com` | `owner123` | `/owner/dashboard` |
| **Customer** | `user@foodora.com` | `user123` | `/account` |

---

## 📄 License
This project is licensed under the MIT License.
