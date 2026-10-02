/**
 * FOODORA - Main Client-Side JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initSearchAutocomplete();
  initFavorites();
});

// Sticky header on scroll
function initHeader() {
  const header = document.getElementById('siteHeader');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // User Dropdown toggle
  const userBtn = document.getElementById('userMenuBtn');
  const userDropdown = document.getElementById('userDropdown');
  if (userBtn && userDropdown) {
    userBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdown.classList.toggle('active');
    });
    document.addEventListener('click', () => {
      userDropdown.classList.remove('active');
    });
  }

  // Hamburger menu toggle
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('active');
    });
  }

  // Mobile search toggle
  const mobileSearchBtn = document.getElementById('mobileSearchBtn');
  const mobileSearchBar = document.getElementById('mobileSearchBar');
  const closeMobileSearch = document.getElementById('closeMobileSearch');
  if (mobileSearchBtn && mobileSearchBar) {
    mobileSearchBtn.addEventListener('click', () => {
      mobileSearchBar.classList.add('active');
      document.getElementById('mobileSearchInput')?.focus();
    });
    closeMobileSearch?.addEventListener('click', () => {
      mobileSearchBar.classList.remove('active');
    });
  }
}

// Live search autocomplete
function initSearchAutocomplete() {
  const searchInput = document.getElementById('searchInput');
  const suggestionsBox = document.getElementById('searchSuggestions');
  let debounceTimeout;

  if (searchInput && suggestionsBox) {
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimeout);
      const query = e.target.value.trim();

      if (query.length < 2) {
        suggestionsBox.innerHTML = '';
        suggestionsBox.classList.remove('active');
        return;
      }

      debounceTimeout = setTimeout(async () => {
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
          const items = await res.json();

          if (items.length > 0) {
            suggestionsBox.innerHTML = items.map(item => `
              <a href="/restaurant/${item.id}" class="suggestion-item">
                <div class="suggestion-info">
                  <h5>${item.name}</h5>
                  <p>${item.sub} • ${item.area}</p>
                </div>
                <span class="badge-star"><i class="ri-star-fill"></i> ${item.rating}</span>
              </a>
            `).join('');
            suggestionsBox.classList.add('active');
          } else {
            suggestionsBox.innerHTML = `
              <div style="padding:1rem;text-align:center;color:var(--text-muted);font-size:0.88rem;">
                No restaurants found for "${query}"
              </div>
            `;
            suggestionsBox.classList.add('active');
          }
        } catch (err) {
          console.error(err);
        }
      }, 250);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
        suggestionsBox.classList.remove('active');
      }
    });

    // Press Enter to go to search results page
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) window.location.href = `/search?q=${encodeURIComponent(query)}`;
      }
    });
  }

  // Mobile search enter key
  const mobileSearchInput = document.getElementById('mobileSearchInput');
  if (mobileSearchInput) {
    mobileSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = mobileSearchInput.value.trim();
        if (query) window.location.href = `/search?q=${encodeURIComponent(query)}`;
      }
    });
  }
}

// Location Modal Functions
function openLocationModal() {
  document.getElementById('locationModal')?.classList.add('active');
}

function closeLocationModal() {
  document.getElementById('locationModal')?.classList.remove('active');
}

async function saveLocation() {
  const city = document.getElementById('locCity')?.value || 'Pune';
  const area = document.getElementById('locArea')?.value || '';
  const pincode = document.getElementById('locPincode')?.value || '';

  try {
    const res = await fetch('/set-location', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city, area, pincode })
    });
    const data = await res.json();
    if (data.success) {
      const display = document.getElementById('locationDisplay');
      if (display) display.textContent = area ? `${city}, ${area}` : city;
      closeLocationModal();
      window.location.reload();
    }
  } catch (err) {
    console.error(err);
  }
}

// Favorite Toggle
function initFavorites() {
  document.querySelectorAll('.btn-fav-toggle').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const restaurantId = btn.dataset.restaurantId;
      try {
        const res = await fetch('/favorites/toggle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ restaurantId })
        });
        const data = await res.json();
        if (data.success) {
          const icon = btn.querySelector('i');
          if (data.favorited) {
            icon.className = 'ri-heart-3-fill';
            icon.style.color = '#EF4444';
          } else {
            icon.className = 'ri-heart-3-line';
            icon.style.color = '';
          }
        }
      } catch (err) {
        console.error(err);
      }
    });
  });
}

// Password toggle
function togglePasswordVisibility(fieldId, btn) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  if (field.type === 'password') {
    field.type = 'text';
    btn.innerHTML = '<i class="ri-eye-off-line"></i>';
  } else {
    field.type = 'password';
    btn.innerHTML = '<i class="ri-eye-line"></i>';
  }
}

// Quick demo login fill
function fillDemoLogin(role) {
  const emailInput = document.getElementById('email');
  const passInput = document.getElementById('password');
  if (!emailInput || !passInput) return;

  if (role === 'admin') {
    emailInput.value = 'admin@foodora.com';
    passInput.value = 'admin123';
  } else if (role === 'owner') {
    emailInput.value = 'owner@foodora.com';
    passInput.value = 'owner123';
  } else {
    emailInput.value = 'user@foodora.com';
    passInput.value = 'user123';
  }
}

// Copy coupon code
function copyCouponCode(code) {
  navigator.clipboard.writeText(code).then(() => {
    alert(`Coupon "${code}" copied to clipboard! Apply it at checkout.`);
  }).catch(() => {
    prompt('Copy your coupon code:', code);
  });
}

// Toast helper
function showToast(message, type = 'success') {
  const existing = document.getElementById('flashMsg');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'flashMsg';
  toast.className = `flash-message flash-${type}`;
  toast.innerHTML = `
    <i class="ri-${type === 'success' ? 'checkbox-circle' : 'error-warning'}-line"></i>
    ${message}
    <button onclick="this.parentElement.remove()"><i class="ri-close-line"></i></button>
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// ================= Admin Actions =================
async function quickUpdateOrderStatus(orderId, newStatus) {
  try {
    const res = await fetch(`/admin/orders/${orderId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    const data = await res.json();
    if (data.success) {
      showToast(`Order status updated to "${newStatus}"!`);
      const badge = document.getElementById(`status-badge-${orderId}`);
      if (badge) {
        badge.textContent = newStatus;
        badge.className = `status-badge status-${newStatus.toLowerCase().replace(/\s+/g, '-')}`;
      }
    } else {
      showToast('Failed to update status', 'error');
    }
  } catch (err) {
    showToast('Network error', 'error');
  }
}

async function toggleRestaurantStatus(restaurantId) {
  try {
    const res = await fetch(`/admin/restaurants/${restaurantId}/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (data.success) {
      showToast(`Restaurant marked ${data.isActive ? 'Active' : 'Inactive'}!`);
      const badge = document.getElementById(`r-status-${restaurantId}`);
      if (badge) {
        badge.textContent = data.isActive ? 'Active' : 'Inactive';
        badge.className = `status-badge ${data.isActive ? 'status-delivered' : 'status-cancelled'}`;
      }
      setTimeout(() => window.location.reload(), 800);
    }
  } catch (err) {
    showToast('Failed to change restaurant status', 'error');
  }
}

async function deleteReview(reviewId) {
  if (!confirm('Are you sure you want to remove this review?')) return;
  try {
    const res = await fetch(`/admin/reviews/${reviewId}/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (data.success) {
      showToast('Review removed.');
      document.getElementById(`review-row-${reviewId}`)?.remove();
    }
  } catch (err) {
    showToast('Error removing review', 'error');
  }
}

// ================= Restaurant Owner Actions =================
async function ownerUpdateOrderStatus(orderId, status) {
  try {
    const res = await fetch(`/owner/order/${orderId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (data.success) {
      showToast(`Order updated to ${status}`);
      const badge = document.getElementById(`owner-status-${orderId}`);
      if (badge) {
        badge.textContent = status;
        badge.className = `status-badge status-${status.toLowerCase().replace(/\s+/g, '-')}`;
      }
    }
  } catch (err) {
    showToast('Error updating status', 'error');
  }
}

async function toggleMenuItemAvailability(itemId) {
  try {
    const res = await fetch(`/owner/menu/${itemId}/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (data.success) {
      showToast(`Item marked ${data.isAvailable ? 'Available' : 'Sold Out'}`);
      const badge = document.getElementById(`avail-badge-${itemId}`);
      const btn = document.getElementById(`avail-btn-${itemId}`);
      if (badge) {
        badge.textContent = data.isAvailable ? 'Available' : 'Sold Out';
        badge.className = `status-badge ${data.isAvailable ? 'status-delivered' : 'status-cancelled'}`;
      }
      if (btn) {
        btn.textContent = data.isAvailable ? 'Mark Sold Out' : 'Mark Available';
        btn.className = `btn-action-sm ${data.isAvailable ? 'btn-danger' : 'btn-success'}`;
      }
    }
  } catch (err) {
    showToast('Error updating item availability', 'error');
  }
}

async function handleAddNewDish(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    const res = await fetch('/owner/menu/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const resData = await res.json();
    if (resData.success) {
      showToast('New dish added to your menu!');
      setTimeout(() => window.location.reload(), 800);
    } else {
      showToast('Failed to add dish', 'error');
    }
  } catch (err) {
    showToast('Network error', 'error');
  }
}
