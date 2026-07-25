/* ============================================================
   CartShare — Activity Log
   Logging and rendering the activity feed
   ============================================================ */

const CartShareActivity = (() => {
  const MAX_LOG_ENTRIES = 100;

  /**
   * Add an entry to the activity log
   */
  function logActivity(roomId, entry) {
    const room = CartShareStorage.getRoom(roomId);
    if (!room) return null;

    const logEntry = {
      id: CartShareUtils.generateId(),
      action: entry.action || 'unknown',
      userName: entry.userName || 'Someone',
      itemName: entry.itemName || null,
      details: entry.details || '',
      timestamp: CartShareUtils.now()
    };

    room.activityLog.unshift(logEntry);

    // Cap the log
    if (room.activityLog.length > MAX_LOG_ENTRIES) {
      room.activityLog = room.activityLog.slice(0, MAX_LOG_ENTRIES);
    }

    CartShareStorage.saveRoom(room);
    return logEntry;
  }

  /**
   * Get icon and color class for an action type
   */
  function getActionDisplay(action) {
    const map = {
      added:    { icon: 'fa-plus-circle', class: 'added' },
      removed:  { icon: 'fa-minus-circle', class: 'removed' },
      updated:  { icon: 'fa-pen', class: 'updated' },
      joined:   { icon: 'fa-user-plus', class: 'joined' },
      left:     { icon: 'fa-user-minus', class: 'left' },
      cleared:  { icon: 'fa-trash', class: 'removed' }
    };
    return map[action] || { icon: 'fa-circle', class: '' };
  }

  /**
   * Build a human-readable description for an entry
   */
  function formatEntryDetails(entry) {
    if (entry.details) return entry.details;

    switch (entry.action) {
      case 'added':
        return `${entry.userName} added ${entry.itemName}`;
      case 'removed':
        return `${entry.userName} removed ${entry.itemName}`;
      case 'updated':
        return `${entry.userName} updated ${entry.itemName}`;
      case 'joined':
        return `${entry.userName} joined the room`;
      case 'left':
        return `${entry.userName} left the room`;
      default:
        return entry.details || 'Unknown action';
    }
  }

  /**
   * Render the activity log into the feed container
   */
  function renderActivityLog(room) {
    const container = document.getElementById('activityFeed');
    if (!container || !room) return;

    const log = room.activityLog || [];

    if (log.length === 0) {
      container.innerHTML = `
        <div class="text-center py-4" style="color: var(--cs-muted);">
          <i class="fas fa-inbox" style="font-size: 2rem; display:block; margin-bottom:0.5rem; opacity:0.4;"></i>
          <p style="font-size:0.875rem; margin:0;">No activity yet. Start adding items!</p>
        </div>
      `;
      return;
    }

    let html = '';
    log.forEach((entry, index) => {
      const display = getActionDisplay(entry.action);
      const time = CartShareUtils.timeAgo(entry.timestamp);
      const details = formatEntryDetails(entry);

      html += `
        <div class="activity-item ${index === 0 ? 'activity-item-enter' : ''}">
          <div class="activity-icon ${display.class}">
            <i class="fas ${display.icon}"></i>
          </div>
          <div class="activity-body">
            <div class="activity-action">${details}</div>
            <span class="activity-time">${time}</span>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  return {
    logActivity,
    renderActivityLog,
    formatEntryDetails
  };
})();
