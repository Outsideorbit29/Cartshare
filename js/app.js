/* ============================================================
   CartShare — Main Application Entry Point
   Initializes the correct page controller based on URL
   ============================================================ */

(function () {
  'use strict';

  /**
   * Initialize the landing page (index.html)
   */
  function initLandingPage() {
    const userNameInput = document.getElementById('userName');
    const createBtn = document.getElementById('createRoomBtn');
    const joinBtn = document.getElementById('joinRoomBtn');
    const joinRoomCodeInput = document.getElementById('joinRoomCode');

    // Persist name across tabs
    if (userNameInput) {
      const saved = localStorage.getItem('cartshare_lastUser');
      if (saved) userNameInput.value = saved;
    }

    function getCreateName() {
      const name = document.getElementById('userName')?.value.trim() || '';
      if (name) localStorage.setItem('cartshare_lastUser', name);
      return name;
    }

    function getJoinName() {
      const name = document.getElementById('userName')?.value.trim() || '';
      if (name) localStorage.setItem('cartshare_lastUser', name);
      return name;
    }

    // Enter key on username field focuses create tab
    if (userNameInput) {
      userNameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const createTab = document.querySelector('#roomTabs [data-bs-target="#create"]');
          if (createTab) {
            const tab = new bootstrap.Tab(createTab);
            tab.show();
          }
        }
      });
    }

    if (createBtn) {
      createBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const name = getCreateName();
        // Optionally get a custom room name
        CartShareRoom.createRoom(name || 'Guest');
      });
    }

    if (joinBtn) {
      joinBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const code = joinRoomCodeInput?.value.trim() || '';
        const name = getJoinName();
        CartShareRoom.joinRoom(code, name || 'Guest');
      });
    }

    // Allow Enter to submit join form
    if (joinRoomCodeInput) {
      joinRoomCodeInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          joinBtn?.click();
        }
      });
    }
  }

  /**
   * Initialize the room page (room.html)
   */
  function initRoomPage() {
    const { valid, room, error } = CartShareRoom.validateSession();

    if (!valid || !room) {
      // Redirect with error message
      sessionStorage.setItem('cartshare_error', error || 'Invalid session');
      window.location.href = 'index.html';
      return;
    }

    const roomId = CartShareRoom.getRoomIdFromUrl();
    const userName = CartShareRoom.getUserNameFromUrl();

    // --- UI Setup ---

    // Set room code badge
    const roomCodeEl = document.getElementById('roomCode');
    if (roomCodeEl) {
      roomCodeEl.textContent = roomId;

      // Copy to clipboard on click
      roomCodeEl.parentElement?.addEventListener('click', () => {
        navigator.clipboard.writeText(roomId).then(() => {
          CartShareUtils.showToast('Room code copied!', 'info');
        }).catch(() => {
          // Fallback
          const textArea = document.createElement('textarea');
          textArea.value = roomId;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          textArea.remove();
          CartShareUtils.showToast('Room code copied!', 'info');
        });
      });
    }

    // Set username display
    const userDisplay = document.getElementById('currentUser');
    if (userDisplay) {
      userDisplay.innerHTML = `
        <span class="avatar" style="background:var(--cs-accent);">${CartShareUtils.getInitials(userName)}</span>
        ${escapeHtml(userName)}
      `;
    }

    // Update participants
    updateParticipants(room);

    // --- Render Initial State ---
    CartShareCart.renderCart(room);
    CartShareActivity.renderActivityLog(room);

    // --- Event Listeners ---

    // Add item form
    const addForm = document.getElementById('addItemForm');
    if (addForm) {
      addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('itemName');
        const priceInput = document.getElementById('itemPrice');
        const qtyInput = document.getElementById('itemQuantity');

        CartShareCart.addItem(roomId, {
          name: nameInput?.value || '',
          price: priceInput?.value || 0,
          quantity: qtyInput?.value || 1
        }, userName);

        // Reset form
        if (nameInput) nameInput.value = '';
        if (priceInput) priceInput.value = '';
        if (qtyInput) qtyInput.value = '1';
        nameInput?.focus();
      });
    }

    // Quick add: Enter in item name field
    const itemNameInput = document.getElementById('itemName');
    if (itemNameInput) {
      itemNameInput.focus();
    }

    // Clear cart button
    const clearBtn = document.getElementById('clearCartBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (room.items.length === 0) {
          CartShareUtils.showToast('Cart is already empty', 'info');
          return;
        }
        if (confirm('Clear all items from the cart?')) {
          CartShareCart.clearCart(roomId, userName);
        }
      });
    }

    // Leave room button
    const leaveBtn = document.getElementById('leaveRoomBtn');
    if (leaveBtn) {
      leaveBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to leave this room?')) {
          CartShareRoom.leaveRoom(roomId, userName);
        }
      });
    }

    // Receipt button
    const receiptBtn = document.getElementById('receiptBtn');
    if (receiptBtn) {
      receiptBtn.addEventListener('click', () => {
        const freshRoom = CartShareStorage.getRoom(roomId);
        CartShareReceipt.openReceiptModal(freshRoom);
      });
    }

    // Print receipt button (inside modal)
    const printBtn = document.getElementById('printReceiptBtn');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        CartShareReceipt.printReceipt();
      });
    }

    // --- Sync Setup ---
    CartShareSync.init();

    CartShareSync.onMessage((message) => {
      // Only respond to messages for our room
      if (message.roomId !== roomId) return;

      const currentRoom = CartShareStorage.getRoom(roomId);
      if (!currentRoom) return;

      switch (message.type) {
        case 'ROOM_UPDATE':
          // Re-render cart and activity
          CartShareCart.renderCart(currentRoom);
          CartShareActivity.renderActivityLog(currentRoom);
          updateParticipants(currentRoom);

          // Flash the room code badge to show activity
          flashRoomCode();
          break;

        case 'USER_JOINED':
          updateParticipants(currentRoom);
          CartShareActivity.renderActivityLog(currentRoom);
          CartShareUtils.showToast(`${message.data.userName} joined the room`, 'info');
          break;

        case 'USER_LEFT':
          updateParticipants(currentRoom);
          CartShareActivity.renderActivityLog(currentRoom);
          CartShareUtils.showToast(`${message.data.userName} left the room`, 'warning');
          break;

        default:
          break;
      }
    });

    // Listen for storage events from other tabs (backup sync)
    window.addEventListener('storage', (e) => {
      if (e.key === CartShareStorage._roomKey?.(roomId) || e.key?.includes(roomId)) {
        const updatedRoom = CartShareStorage.getRoom(roomId);
        if (updatedRoom) {
          CartShareCart.renderCart(updatedRoom);
          CartShareActivity.renderActivityLog(updatedRoom);
          updateParticipants(updatedRoom);
        }
      }
    });

    // --- Helper Functions ---

    function flashRoomCode() {
      const badge = document.querySelector('.room-code-badge');
      if (badge) {
        badge.classList.remove('activity-flash');
        // Force reflow
        void badge.offsetWidth;
        badge.classList.add('activity-flash');
      }
    }

    function escapeHtml(str) {
      if (typeof str !== 'string') return '';
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    function updateParticipants(roomData) {
      const count = document.getElementById('userCount');
      const list = document.getElementById('userList');
      if (!roomData) return;

      const users = roomData.users || [];

      if (count) {
        count.textContent = users.length + (users.length === 1 ? ' user' : ' users');
      }

      if (list) {
        let html = '';
        users.forEach(u => {
          const initials = CartShareUtils.getInitials(u.name);
          const isCurrent = u.name.toLowerCase() === userName.toLowerCase();
          html += `
            <span class="user-pill ${isCurrent ? '' : ''}" style="${isCurrent ? 'border: 2px solid var(--cs-primary);' : ''}">
              <span class="avatar">${initials}</span>
              ${escapeHtml(u.name)} ${isCurrent ? '<span style="font-size:0.7rem;color:var(--cs-muted);">(you)</span>' : ''}
            </span>
          `;
        });
        list.innerHTML = html || '<span style="color:var(--cs-muted);font-size:0.875rem;">No participants</span>';
      }
    }
  }

  /**
   * Check if there's a session error to show
   */
  function showSessionError() {
    const error = sessionStorage.getItem('cartshare_error');
    if (error) {
      sessionStorage.removeItem('cartshare_error');
      setTimeout(() => {
        CartShareUtils.showToast(error, 'danger');
      }, 500);
    }
  }

  // --- Page Router ---
  document.addEventListener('DOMContentLoaded', function () {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';

    // Always init the sync module for potential cross-tab comm
    CartShareSync.init();

    if (filename === 'room.html' || path.includes('room.html')) {
      initRoomPage();
    } else {
      // Default to landing page
      showSessionError();
      initLandingPage();
    }
  });
})();
