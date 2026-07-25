/* ============================================================
   CartShare — Cross-Tab Sync via BroadcastChannel API
   ============================================================ */

const CartShareSync = (() => {
  const CHANNEL_NAME = 'cartshare';
  let channel = null;
  let listeners = [];

  /**
   * Initialize the BroadcastChannel and attach listeners
   */
  function init() {
    if (channel) return; // already initialized

    try {
      channel = new BroadcastChannel(CHANNEL_NAME);

      channel.onmessage = (event) => {
        const message = event.data;
        if (!message || !message.type || !message.roomId) return;

        // Notify all registered listeners
        listeners.forEach(fn => {
          try { fn(message); } catch (e) { console.warn('Sync listener error:', e); }
        });
      };
    } catch (e) {
      console.warn('BroadcastChannel not supported — sync disabled', e);
      channel = null;
    }

    return {
      broadcast: broadcast,
      onMessage: onMessage,
      removeListener: removeListener,
      isSupported: isSupported,
      destroy: destroy
    };
  }

  /**
   * Broadcast a message to all tabs
   */
  function broadcast(type, roomId, data = {}) {
    if (!channel) return;

    const message = { type, roomId, data, timestamp: CartShareUtils.now() };
    try {
      channel.postMessage(message);
    } catch (e) {
      console.warn('Broadcast failed:', e);
    }
  }

  /**
   * Register a message listener
   * Returns an unsubscribe function
   */
  function onMessage(callback) {
    listeners.push(callback);
    return () => removeListener(callback);
  }

  /**
   * Remove a listener
   */
  function removeListener(callback) {
    listeners = listeners.filter(fn => fn !== callback);
  }

  /**
   * Check if BroadcastChannel is supported
   */
  function isSupported() {
    return channel !== null;
  }

  /**
   * Clean up the channel
   */
  function destroy() {
    if (channel) {
      try { channel.close(); } catch (e) { /* ignore */ }
      channel = null;
    }
    listeners = [];
  }

  return { init, broadcast, onMessage, removeListener, isSupported, destroy };
})();
