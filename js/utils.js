/* ============================================================
   CartShare — Utilities
   Helper functions for IDs, formatting, room codes
   ============================================================ */

const CartShareUtils = {

  /**
   * Generate a 6-character uppercase room code (no ambiguous chars)
   */
  generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  },

  /**
   * Generate a UUID v4 string
   */
  generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
  },

  /**
   * Format a number as currency (USD)
   */
  formatCurrency(amount) {
    return '₹' + Number(amount).toFixed(0);
  },

  /**
   * Get a user's initials from their name
   */
  getInitials(name) {
    if (!name) return '?';
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(w => w[0].toUpperCase())
      .join('');
  },

  /**
   * Get current timestamp in milliseconds
   */
  now() {
    return Date.now();
  },

  /**
   * Format a timestamp as a relative time string (e.g., "2 min ago")
   */
  timeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 5) return 'just now';
    if (seconds < 60) return seconds + 's ago';
    if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
    if (seconds < 604800) return Math.floor(seconds / 86400) + 'd ago';

    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  /**
   * Safe parse JSON or return fallback
   */
  safeJsonParse(str, fallback = null) {
    if (str === null || str === undefined) return fallback;
    try {
      return JSON.parse(str);
    } catch {
      return fallback;
    }
  },

  /**
   * Get query parameter from URL
   */
  getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name) || '';
  },

  /**
   * Show a toast notification
   */
  showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const bgMap = {
      success: 'var(--cs-success-light)',
      danger: 'var(--cs-danger-light)',
      warning: 'var(--cs-warm-light)',
      info: 'var(--cs-primary-light)'
    };
    const colorMap = {
      success: 'var(--cs-text)',
      danger: 'var(--cs-danger)',
      warning: 'var(--cs-text)',
      info: 'var(--cs-primary)'
    };
    const iconMap = {
      success: 'fa-check-circle',
      danger: 'fa-exclamation-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle'
    };

    // Reuse existing toast if possible
    let toastEl = container.querySelector('.toast-custom:last-child');
    if (toastEl) {
      const body = toastEl.querySelector('.toast-body');
      body.innerHTML = `<i class="fas ${iconMap[type]}" style="margin-right:0.4rem;"></i> ${message}`;
      toastEl.style.background = bgMap[type];
      body.style.color = colorMap[type];
      // Re-trigger by removing and re-adding
      const bsToast = bootstrap.Toast.getInstance(toastEl);
      if (bsToast) bsToast.show();
      return;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'toast-custom toast';
    wrapper.setAttribute('role', 'alert');
    wrapper.setAttribute('aria-live', 'assertive');
    wrapper.setAttribute('aria-atomic', 'true');
    wrapper.style.background = bgMap[type];

    wrapper.innerHTML = `
      <div class="toast-body" style="color: ${colorMap[type]};">
        <i class="fas ${iconMap[type]}" style="margin-right:0.4rem;"></i> ${message}
      </div>
    `;

    container.appendChild(wrapper);
    const bsToast = new bootstrap.Toast(wrapper, { delay: 3000 });
    bsToast.show();

    wrapper.addEventListener('hidden.bs.toast', () => wrapper.remove());
  }
};
