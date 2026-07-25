/* ============================================================
   CartShare — Room Management
   Create, join, leave rooms, URL param parsing
   ============================================================ */

const CartShareRoom = (() => {
  /**
   * Create a new room with a random code, then redirect
   */
  function createRoom(userName) {
    const name = userName.trim();
    if (!name) {
      CartShareUtils.showToast('Please enter your name', 'warning');
      return false;
    }

    // Generate a unique room code
    let roomId;
    let attempts = 0;
    do {
      roomId = CartShareUtils.generateRoomCode();
      attempts++;
      if (attempts > 50) {
        CartShareUtils.showToast('Could not generate unique room code', 'danger');
        return false;
      }
    } while (CartShareStorage.roomExists(roomId));

    // Create room in storage
    CartShareStorage.createRoom(roomId, name);

    // Log activity
    CartShareActivity.logActivity(roomId, {
      action: 'joined',
      userName: name,
      itemName: null,
      details: `${name} created the room`
    });

    // Redirect to room page
    window.location.href = `room.html?room=${roomId}&user=${encodeURIComponent(name)}`;
    return true;
  }

  /**
   * Join an existing room, then redirect
   */
  function joinRoom(roomId, userName) {
    const cleanId = roomId.trim().toUpperCase();
    const name = userName.trim();

    if (!cleanId) {
      CartShareUtils.showToast('Please enter a room code', 'warning');
      return false;
    }
    if (!name) {
      CartShareUtils.showToast('Please enter your name', 'warning');
      return false;
    }

    // Check if room exists
    if (!CartShareStorage.roomExists(cleanId)) {
      CartShareUtils.showToast('Room not found. Check the code and try again.', 'danger');
      return false;
    }

    // Add user to room
    const room = CartShareStorage.addUserToRoom(cleanId, name);
    if (!room) {
      CartShareUtils.showToast('Could not join room', 'danger');
      return false;
    }

    // Log activity
    CartShareActivity.logActivity(cleanId, {
      action: 'joined',
      userName: name,
      itemName: null,
      details: `${name} joined the room`
    });

    // Broadcast the join event
    CartShareSync.broadcast('USER_JOINED', cleanId, { userName: name, users: room.users });

    // Redirect
    window.location.href = `room.html?room=${cleanId}&user=${encodeURIComponent(name)}`;
    return true;
  }

  /**
   * Leave a room
   */
  function leaveRoom(roomId, userName) {
    if (!roomId || !userName) return;

    const name = userName.trim();

    // Log activity before removing user
    CartShareActivity.logActivity(roomId, {
      action: 'left',
      userName: name,
      itemName: null,
      details: `${name} left the room`
    });

    // Remove user from room
    const room = CartShareStorage.removeUserFromRoom(roomId, name);

    // Broadcast the leave event
    CartShareSync.broadcast('USER_LEFT', roomId, { userName: name, users: room ? room.users : [] });

    // Redirect to landing page
    window.location.href = 'index.html';
  }

  /**
   * Get current room ID from URL params
   */
  function getRoomIdFromUrl() {
    return CartShareUtils.getQueryParam('room').toUpperCase();
  }

  /**
   * Get current username from URL params
   */
  function getUserNameFromUrl() {
    return CartShareUtils.getQueryParam('user');
  }

  /**
   * Validate that the room exists and user is valid
   * Returns { valid, room, error }
   */
  function validateSession() {
    const roomId = getRoomIdFromUrl();
    const userName = getUserNameFromUrl();

    if (!roomId) {
      return { valid: false, room: null, error: 'No room specified' };
    }

    const room = CartShareStorage.getRoom(roomId);
    if (!room) {
      return { valid: false, room: null, error: 'Room not found' };
    }

    if (!userName) {
      return { valid: false, room: room, error: 'No username specified' };
    }

    // Check user is in the room (or add them if missing — handles fresh tabs)
    const userExists = room.users.some(u => u.name.toLowerCase() === userName.toLowerCase());
    if (!userExists) {
      // Auto-add this user (they might have opened a new tab)
      CartShareStorage.addUserToRoom(roomId, userName);
    }

    return { valid: true, room: CartShareStorage.getRoom(roomId), error: null };
  }

  return {
    createRoom,
    joinRoom,
    leaveRoom,
    getRoomIdFromUrl,
    getUserNameFromUrl,
    validateSession
  };
})();
