/* ============================================================
   CartShare — Cart Management
   Add/remove/update items, render cart table
   ============================================================ */

const CartShareCart = (() => {

  /**
   * Add an item to the cart
   */
  function addItem(roomId, itemData, userName) {
    const room = CartShareStorage.getRoom(roomId);
    if (!room) return null;

    const name = itemData.name.trim();
    const price = parseFloat(itemData.price) || 0;
    const quantity = parseInt(itemData.quantity, 10) || 1;

    if (!name) {
      CartShareUtils.showToast('Please enter an item name', 'warning');
      return null;
    }
    if (price <= 0) {
      CartShareUtils.showToast('Please enter a valid price', 'warning');
      return null;
    }
    if (quantity <= 0) {
      CartShareUtils.showToast('Quantity must be at least 1', 'warning');
      return null;
    }

    const item = {
      id: CartShareUtils.generateId(),
      name: name,
      price: price,
      quantity: quantity,
      addedBy: userName.trim(),
      timestamp: CartShareUtils.now()
    };

    room.items.push(item);
    CartShareStorage.saveRoom(room);

    // Log activity
    CartShareActivity.logActivity(roomId, {
      action: 'added',
      userName: userName.trim(),
      itemName: name,
      details: `${userName.trim()} added ${quantity}× ${name} (${CartShareUtils.formatCurrency(price)} each)`
    });

    // Broadcast update
    CartShareSync.broadcast('ROOM_UPDATE', roomId, { room: room });

    // Re-render local UI immediately
    const updatedRoom = CartShareStorage.getRoom(roomId);
    if (updatedRoom) {
      renderCart(updatedRoom);
      CartShareActivity.renderActivityLog(updatedRoom);
    }

    CartShareUtils.showToast(`Added ${item.name} to cart`, 'success');
    return item;
  }

  /**
   * Remove an item from the cart
   */
  function removeItem(roomId, itemId, userName) {
    const room = CartShareStorage.getRoom(roomId);
    if (!room) return false;

    const itemIndex = room.items.findIndex(i => i.id === itemId);
    if (itemIndex === -1) return false;

    const item = room.items[itemIndex];
    room.items.splice(itemIndex, 1);
    CartShareStorage.saveRoom(room);

    // Log activity
    CartShareActivity.logActivity(roomId, {
      action: 'removed',
      userName: userName.trim(),
      itemName: item.name,
      details: `${userName.trim()} removed ${item.name}`
    });

    // Broadcast update
    CartShareSync.broadcast('ROOM_UPDATE', roomId, { room: room });

    // Re-render local UI immediately
    const updatedRoom = CartShareStorage.getRoom(roomId);
    if (updatedRoom) {
      renderCart(updatedRoom);
      CartShareActivity.renderActivityLog(updatedRoom);
    }

    CartShareUtils.showToast(`Removed ${item.name} from cart`, 'info');
    return true;
  }

  /**
   * Update an item's quantity
   */
  function updateQuantity(roomId, itemId, newQuantity, userName) {
    const room = CartShareStorage.getRoom(roomId);
    if (!room) return false;

    const item = room.items.find(i => i.id === itemId);
    if (!item) return false;

    const qty = parseInt(newQuantity, 10);
    if (qty <= 0) {
      // Remove the item if quantity is 0 or negative
      return removeItem(roomId, itemId, userName);
    }

    const oldQty = item.quantity;
    item.quantity = qty;
    item.timestamp = CartShareUtils.now();
    CartShareStorage.saveRoom(room);

    // Log activity
    CartShareActivity.logActivity(roomId, {
      action: 'updated',
      userName: userName.trim(),
      itemName: item.name,
      details: `${userName.trim()} changed ${item.name} quantity: ${oldQty} → ${qty}`
    });

    // Broadcast update
    CartShareSync.broadcast('ROOM_UPDATE', roomId, { room: room });

    // Re-render local UI immediately
    const updatedRoom = CartShareStorage.getRoom(roomId);
    if (updatedRoom) {
      renderCart(updatedRoom);
      CartShareActivity.renderActivityLog(updatedRoom);
    }

    return true;
  }

  /**
   * Clear all items from the cart
   */
  function clearCart(roomId, userName) {
    const room = CartShareStorage.getRoom(roomId);
    if (!room || room.items.length === 0) return false;

    const itemCount = room.items.length;
    room.items = [];
    CartShareStorage.saveRoom(room);

    // Log activity
    CartShareActivity.logActivity(roomId, {
      action: 'cleared',
      userName: userName.trim(),
      itemName: null,
      details: `${userName.trim()} cleared all ${itemCount} items from the cart`
    });

    // Broadcast update
    CartShareSync.broadcast('ROOM_UPDATE', roomId, { room: room });

    // Re-render local UI immediately
    const updatedRoom = CartShareStorage.getRoom(roomId);
    if (updatedRoom) {
      renderCart(updatedRoom);
      CartShareActivity.renderActivityLog(updatedRoom);
    }

    CartShareUtils.showToast('Cart cleared', 'info');
    return true;
  }

  /**
   * Render the cart table and summary
   */
  function renderCart(room) {
    const container = document.getElementById('cartItems');
    const summary = document.getElementById('cartSummary');
    if (!container) return;

    const items = room.items || [];

    if (items.length === 0) {
      container.innerHTML = `
        <div class="empty-cart">
          <i class="fas fa-shopping-cart"></i>
          <p>Your cart is empty. Add some items to get started!</p>
        </div>
      `;
      if (summary) {
        const totalItems = CartShareStorage.getItemCount(room);
        const totalCost = CartShareStorage.getTotalCost(room);
        summary.innerHTML = `
          <span>
            <span class="summary-label">Items:</span>
            <span class="summary-value" style="font-size:1rem;">${totalItems}</span>
          </span>
          <span>
            <span class="summary-label">Total:</span>
            <span class="summary-value">${CartShareUtils.formatCurrency(totalCost)}</span>
          </span>
        `;
      }
      return;
    }

    let html = '';
    items.forEach((item, index) => {
      const itemTotal = (item.price || 0) * (item.quantity || 0);
      const time = CartShareUtils.timeAgo(item.timestamp);

      html += `
        <tr class="${index === 0 ? 'item-enter' : ''}">
          <td data-label="Item">
            <span class="item-name">${escapeHtml(item.name)}</span>
            <div class="item-meta">by <strong>${escapeHtml(item.addedBy)}</strong> · ${time}</div>
          </td>
          <td data-label="Price">${CartShareUtils.formatCurrency(item.price)}</td>
          <td data-label="Qty">
            <div class="input-group input-group-sm" style="max-width:110px;">
              <button class="btn btn-outline-secondary btn-sm qty-btn" data-id="${item.id}" data-action="minus" style="border-radius:6px 0 0 6px;">−</button>
              <input type="number" class="form-control form-control-sm qty-input text-center" value="${item.quantity}" min="1" data-id="${item.id}" style="border-radius:0;padding:0.2rem;font-family:var(--cs-font-mono);">
              <button class="btn btn-outline-secondary btn-sm qty-btn" data-id="${item.id}" data-action="plus" style="border-radius:0 6px 6px 0;">+</button>
            </div>
          </td>
          <td data-label="Total" class="item-total text-end">${CartShareUtils.formatCurrency(itemTotal)}</td>
          <td data-label="" class="item-actions text-end">
            <button class="btn btn-danger btn-sm remove-item" data-id="${item.id}" title="Remove item">
              <i class="fas fa-trash-alt"></i>
            </button>
          </td>
        </tr>
      `;
    });

    container.innerHTML = html;

    // Update summary
    if (summary) {
      const totalItems = CartShareStorage.getItemCount(room);
      const totalCost = CartShareStorage.getTotalCost(room);
      summary.innerHTML = `
        <span>
          <span class="summary-label">Items:</span>
          <span class="summary-value" style="font-size:1rem;">${totalItems}</span>
        </span>
        <span>
          <span class="summary-label">Total:</span>
          <span class="summary-value">${CartShareUtils.formatCurrency(totalCost)}</span>
        </span>
      `;
    }

    // Attach event listeners
    attachCartEvents(room.roomId);
  }

  /**
   * Attach event listeners to cart buttons
   */
  function attachCartEvents(roomId) {
    const userName = CartShareRoom.getUserNameFromUrl();

    // Remove buttons
    document.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', function () {
        const itemId = this.dataset.id;
        removeItem(roomId, itemId, userName);
      });
    });

    // Quantity +/- buttons
    document.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const itemId = this.dataset.id;
        const input = document.querySelector(`.qty-input[data-id="${itemId}"]`);
        if (!input) return;
        let val = parseInt(input.value, 10) || 1;
        if (this.dataset.action === 'plus') {
          val++;
        } else {
          val--;
        }
        if (val < 1) val = 1;
        input.value = val;
        updateQuantity(roomId, itemId, val, userName);
      });
    });

    // Quantity input change
    document.querySelectorAll('.qty-input').forEach(input => {
      let debounceTimer;
      input.addEventListener('change', function () {
        clearTimeout(debounceTimer);
        const itemId = this.dataset.id;
        let val = parseInt(this.value, 10);
        if (isNaN(val) || val < 1) val = 1;
        if (val > 999) val = 999;
        this.value = val;
        updateQuantity(roomId, itemId, val, userName);
      });
    });
  }

  /**
   * Simple HTML escaping
   */
  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  return {
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    renderCart
  };
})();
