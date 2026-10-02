/**
 * FOODORA - Cart & Customization Modal JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initCartSidebar();
  initItemModal();
});

// Cart Sidebar
function initCartSidebar() {
  const toggleBtn = document.getElementById('cartToggleBtn');
  const closeBtn = document.getElementById('cartSidebarClose');
  const overlay = document.getElementById('cartOverlay');
  const sidebar = document.getElementById('cartSidebar');

  if (toggleBtn && sidebar && overlay) {
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      sidebar.classList.add('active');
      overlay.classList.add('active');
    });

    closeBtn?.addEventListener('click', () => {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
    });

    overlay.addEventListener('click', () => {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
    });
  }
}

// Item Customization Modal
function initItemModal() {
  const modal = document.getElementById('itemModal');
  const closeBtn = document.getElementById('itemModalClose');

  if (modal && closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }
}

// Open Item Customization Modal
async function openItemModal(restaurantId, itemId) {
  try {
    const res = await fetch(`/restaurant/${restaurantId}/item/${itemId}`);
    const data = await res.json();
    if (!data.success) {
      alert('Could not load item details.');
      return;
    }

    const { item, restaurantName } = data;
    const modalContent = document.getElementById('itemModalContent');
    const modal = document.getElementById('itemModal');

    modalContent.innerHTML = `
      <div class="custom-modal-header">
        <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.4rem;">
          <span class="veg-badge-mini ${item.isVeg ? 'veg' : 'non-veg'}"></span>
          <span style="font-size:0.85rem;color:var(--text-muted);font-weight:600;">${restaurantName}</span>
        </div>
        <h2 style="font-size:1.4rem;font-weight:800;color:var(--text-dark);">${item.name}</h2>
        <p style="font-size:1.15rem;font-weight:800;color:var(--primary);margin-top:0.25rem;">₹<span id="modalBasePrice">${item.price}</span></p>
        <p style="color:var(--text-muted);font-size:0.88rem;margin-top:0.4rem;">${item.description || ''}</p>
      </div>

      <div class="custom-options" style="margin-top:1.5rem;">
        ${item.portionSizes && item.portionSizes.length > 0 ? `
          <div class="form-group">
            <label style="font-weight:700;font-size:0.88rem;">Select Portion Size</label>
            <div style="display:flex;gap:0.75rem;margin-top:0.3rem;">
              ${item.portionSizes.map((p, idx) => `
                <label style="border:1.5px solid var(--gray-200);padding:0.5rem 0.85rem;border-radius:var(--radius-sm);cursor:pointer;flex:1;display:flex;justify-content:space-between;align-items:center;">
                  <input type="radio" name="modalPortion" value="${p.size}" data-extra="${p.extraPrice}" ${idx === 0 ? 'checked' : ''} onchange="updateModalPrice()">
                  <span style="font-size:0.85rem;font-weight:600;">${p.size}</span>
                  <span style="font-size:0.8rem;color:var(--text-muted);">${p.extraPrice > 0 ? '+₹' + p.extraPrice : ''}</span>
                </label>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${item.spiceLevels && item.spiceLevels.length > 0 ? `
          <div class="form-group">
            <label style="font-weight:700;font-size:0.88rem;">Spice Level</label>
            <select id="modalSpiceLevel" style="width:100%;padding:0.6rem;border-radius:var(--radius-md);border:1.5px solid var(--gray-200);">
              ${item.spiceLevels.map(lvl => `<option value="${lvl}">${lvl}</option>`).join('')}
            </select>
          </div>
        ` : ''}

        ${item.addOns && item.addOns.length > 0 ? `
          <div class="form-group">
            <label style="font-weight:700;font-size:0.88rem;">Add-ons & Extras</label>
            <div style="display:flex;flex-direction:column;gap:0.5rem;margin-top:0.3rem;">
              ${item.addOns.map(addon => `
                <label style="display:flex;align-items:center;justify-content:space-between;padding:0.5rem 0.75rem;background:var(--gray-50);border-radius:var(--radius-sm);cursor:pointer;">
                  <div style="display:flex;align-items:center;gap:0.5rem;">
                    <input type="checkbox" name="modalAddon" value="${addon.name}" data-price="${addon.price}" onchange="updateModalPrice()">
                    <span style="font-size:0.88rem;">${addon.name}</span>
                  </div>
                  <span style="font-size:0.85rem;font-weight:700;color:var(--text-dark);">+₹${addon.price}</span>
                </label>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div class="form-group">
          <label style="font-weight:700;font-size:0.88rem;">Special Cooking Requests</label>
          <input type="text" id="modalSpecialInst" placeholder="e.g. Less oil, extra tissues..." style="width:100%;padding:0.6rem;border-radius:var(--radius-md);border:1.5px solid var(--gray-200);">
        </div>
      </div>

      <div style="display:flex;align-items:center;gap:1rem;margin-top:1.5rem;padding-top:1rem;border-top:1px solid var(--gray-200);">
        <div style="display:flex;align-items:center;border:1.5px solid var(--gray-300);border-radius:var(--radius-sm);overflow:hidden;">
          <button type="button" onclick="adjustModalQty(-1)" style="border:none;background:none;padding:0.6rem 0.9rem;font-size:1.1rem;font-weight:700;cursor:pointer;">−</button>
          <span id="modalQtyDisplay" style="font-weight:800;padding:0 0.5rem;">1</span>
          <button type="button" onclick="adjustModalQty(1)" style="border:none;background:none;padding:0.6rem 0.9rem;font-size:1.1rem;font-weight:700;cursor:pointer;">+</button>
        </div>
        <button type="button" class="btn-primary-full" style="flex:1;" onclick="submitModalAddToCart('${restaurantId}', '${item._id}', '${item.name.replace(/'/g, "\\'")}', ${item.price}, '${item.isVeg}', '${item.image || ''}')">
          Add to Cart • ₹<span id="modalFinalPrice">${item.price}</span>
        </button>
      </div>
    `;

    modal.classList.add('active');
  } catch (err) {
    console.error(err);
  }
}

let currentModalQty = 1;
function adjustModalQty(delta) {
  currentModalQty = Math.max(1, currentModalQty + delta);
  document.getElementById('modalQtyDisplay').textContent = currentModalQty;
  updateModalPrice();
}

function updateModalPrice() {
  const baseEl = document.getElementById('modalBasePrice');
  if (!baseEl) return;
  let unitPrice = parseFloat(baseEl.textContent);

  // Portion extra
  const checkedPortion = document.querySelector('input[name="modalPortion"]:checked');
  if (checkedPortion) {
    unitPrice += parseFloat(checkedPortion.dataset.extra || 0);
  }

  // Add-ons
  const checkedAddons = document.querySelectorAll('input[name="modalAddon"]:checked');
  checkedAddons.forEach(a => {
    unitPrice += parseFloat(a.dataset.price || 0);
  });

  const total = unitPrice * currentModalQty;
  document.getElementById('modalFinalPrice').textContent = total.toFixed(0);
}

// Add customized item to cart
async function submitModalAddToCart(restaurantId, itemId, name, basePrice, isVeg, image) {
  let unitPrice = basePrice;
  let portion = 'Regular';
  const checkedPortion = document.querySelector('input[name="modalPortion"]:checked');
  if (checkedPortion) {
    portion = checkedPortion.value;
    unitPrice += parseFloat(checkedPortion.dataset.extra || 0);
  }

  const spiceLevel = document.getElementById('modalSpiceLevel')?.value || 'Medium';
  const specialInstructions = document.getElementById('modalSpecialInst')?.value || '';

  const addOns = [];
  document.querySelectorAll('input[name="modalAddon"]:checked').forEach(a => {
    const price = parseFloat(a.dataset.price || 0);
    unitPrice += price;
    addOns.push({ name: a.value, price });
  });

  try {
    const res = await fetch('/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        restaurantId,
        itemId,
        name,
        price: unitPrice,
        qty: currentModalQty,
        portionSize: portion,
        spiceLevel,
        addOns,
        specialInstructions,
        isVeg: isVeg === 'true' || isVeg === true,
        image
      })
    });

    const data = await res.json();
    if (data.success) {
      document.getElementById('itemModal')?.classList.remove('active');
      currentModalQty = 1;
      updateCartDisplay(data.cart, data.cartCount, data.cartTotal);
      openCartSidebar();
    } else {
      if (confirm(data.msg + '\n\nDo you want to clear your existing cart?')) {
        await fetch('/cart/clear', { method: 'POST' });
        submitModalAddToCart(restaurantId, itemId, name, basePrice, isVeg, image);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

// Quick Add button (defaults)
async function quickAddToCart(restaurantId, itemId, name, price, isVeg) {
  try {
    const res = await fetch('/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        restaurantId,
        itemId,
        name,
        price: parseFloat(price),
        qty: 1,
        isVeg: isVeg === 'true' || isVeg === true
      })
    });

    const data = await res.json();
    if (data.success) {
      updateCartDisplay(data.cart, data.cartCount, data.cartTotal);
      openCartSidebar();
    } else {
      if (confirm(data.msg + '\n\nDo you want to start a new cart from this restaurant?')) {
        await fetch('/cart/clear', { method: 'POST' });
        quickAddToCart(restaurantId, itemId, name, price, isVeg);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

// Update cart quantity
async function updateCartQty(key, newQty) {
  try {
    let res;
    if (newQty <= 0) {
      res = await fetch('/cart/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key })
      });
    } else {
      res = await fetch('/cart/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, qty: newQty })
      });
    }

    const data = await res.json();
    if (data.success) {
      updateCartDisplay(data.cart, data.cartCount, data.cartTotal);
      // If we are on /cart page, reload to recalculate taxes & coupon
      if (window.location.pathname === '/cart' || window.location.pathname === '/checkout') {
        window.location.reload();
      }
    }
  } catch (err) {
    console.error(err);
  }
}

// Update Sidebar Cart HTML
function updateCartDisplay(cart, count, total) {
  // Update header badges
  const badges = document.querySelectorAll('#cartBadge');
  badges.forEach(b => {
    b.textContent = count;
    if (count > 0) b.classList.remove('hidden');
    else b.classList.add('hidden');
  });

  const sidebarCount = document.getElementById('sidebarCartCount');
  if (sidebarCount) sidebarCount.textContent = count;

  const sidebarBody = document.getElementById('cartSidebarBody');
  if (!sidebarBody) return;

  if (cart.length === 0) {
    sidebarBody.innerHTML = `
      <div class="cart-empty-state" style="text-align:center;padding:3rem 1rem;">
        <i class="ri-shopping-bag-2-line" style="font-size:3rem;color:var(--gray-300);"></i>
        <p style="margin:1rem 0;color:var(--text-muted);font-weight:600;">Your cart is empty</p>
        <a href="/restaurants" class="btn-primary-sm">Browse Restaurants</a>
      </div>
    `;
    const footer = document.querySelector('.cart-sidebar-footer');
    if (footer) footer.remove();
    return;
  }

  let html = `
    <div class="cart-restaurant-info" style="font-size:0.85rem;color:var(--primary);font-weight:700;margin-bottom:1rem;display:flex;align-items:center;gap:0.4rem;">
      <i class="ri-store-2-line"></i> ${cart[0].restaurantName || 'Selected Restaurant'}
    </div>
  `;

  cart.forEach(item => {
    html += `
      <div class="cart-sidebar-item">
        <div class="csi-veg-dot ${item.isVeg ? 'veg' : 'non-veg'}"></div>
        <div class="csi-info">
          <p class="csi-name">${item.name}</p>
          <p class="csi-price">₹${(item.price * item.qty).toFixed(0)}</p>
        </div>
        <div class="csi-qty">
          <button class="qty-btn" onclick="updateCartQty('${item.key}', ${item.qty - 1})">−</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="updateCartQty('${item.key}', ${item.qty + 1})">+</button>
        </div>
      </div>
    `;
  });

  sidebarBody.innerHTML = html;

  let footer = document.querySelector('.cart-sidebar-footer');
  if (!footer) {
    footer = document.createElement('div');
    footer.className = 'cart-sidebar-footer';
    document.getElementById('cartSidebar').appendChild(footer);
  }

  footer.innerHTML = `
    <div class="cart-total-row">
      <span>Subtotal</span>
      <span>₹${total.toFixed(0)}</span>
    </div>
    <a href="/checkout" class="btn-checkout-full">Proceed to Checkout →</a>
  `;
}

function openCartSidebar() {
  document.getElementById('cartSidebar')?.classList.add('active');
  document.getElementById('cartOverlay')?.classList.add('active');
}
