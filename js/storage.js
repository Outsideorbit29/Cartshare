/* ============================================================
   CartShare — Storage Layer
   All localStorage CRUD operations
   ============================================================ */

const CartShareStorage = {

  STORAGE_PREFIX: 'cartshare_',
  ROOMS_INDEX_KEY: 'cartshare_rooms',

  /**
   * Get the localStorage key for a room
   */
  _roomKey(roomId) {
    return this.STORAGE_PREFIX + 'room_' + roomId;
  },

  /**
   * Get all room IDs
   */
  getAllRoomIds() {
    const raw = localStorage.getItem(this.ROOMS_INDEX_KEY);
    const rooms = CartShareUtils.safeJsonParse(raw, []);
    return Array.isArray(rooms) ? rooms : [];
  },

  /**
   * Save all room IDs
   */
  _saveAllRoomIds(ids) {
    localStorage.setItem(this.ROOMS_INDEX_KEY, JSON.stringify(ids));
  },

  /**
   * Register a room ID in the index
   */
  _registerRoomId(roomId) {
    const ids = this.getAllRoomIds();
    if (!ids.includes(roomId)) {
      ids.push(roomId);
      this._saveAllRoomIds(ids);
    }
  },

  /**
   * Check if a room exists
   */
  roomExists(roomId) {
    if (!roomId) return false;
    const cleanId = roomId.trim().toUpperCase();
    const raw = localStorage.getItem(this._roomKey(cleanId));
    if (!raw) return false;
    const room = CartShareUtils.safeJsonParse(raw, null);
    return room !== null && room.roomId === cleanId;
  },

  /**
   * Get a room object by ID
   */
  getRoom(roomId) {
    if (!roomId) return null;
    const cleanId = roomId.trim().toUpperCase();
    const raw = localStorage.getItem(this._roomKey(cleanId));
    return CartShareUtils.safeJsonParse(raw, null);
  },

  /**
   * Save a room object
   */
  saveRoom(room) {
    if (!room || !room.roomId) return false;
    room.roomId = room.roomId.trim().toUpperCase();
    localStorage.setItem(this._roomKey(room.roomId), JSON.stringify(room));
    this._registerRoomId(room.roomId);
    return true;
  },

  /**
   * Create a new room
   */
  createRoom(roomId, userName) {
    const now = CartShareUtils.now();
    const room = {
      roomId: roomId.trim().toUpperCase(),
      createdAt: now,
      users: [
        { name: userName.trim(), joinedAt: now }
      ],
      items: [],
      activityLog: []
    };
    this.saveRoom(room);
    return room;
  },

  /**
   * Delete a room
   */
  deleteRoom(roomId) {
    if (!roomId) return;
    const cleanId = roomId.trim().toUpperCase();
    localStorage.removeItem(this._roomKey(cleanId));
    const ids = this.getAllRoomIds().filter(id => id !== cleanId);
    this._saveAllRoomIds(ids);
  },

  /**
   * Add a user to a room
   */
  addUserToRoom(roomId, userName) {
    const room = this.getRoom(roomId);
    if (!room) return null;

    const name = userName.trim();
    if (!name) return null;

    // Check if user already exists
    const exists = room.users.some(u => u.name.toLowerCase() === name.toLowerCase());
    if (!exists) {
      room.users.push({ name, joinedAt: CartShareUtils.now() });
      this.saveRoom(room);
    }

    return room;
  },

  /**
   * Remove a user from a room
   */
  removeUserFromRoom(roomId, userName) {
    const room = this.getRoom(roomId);
    if (!room) return null;

    room.users = room.users.filter(u => u.name.toLowerCase() !== userName.trim().toLowerCase());
    this.saveRoom(room);
    return room;
  },

  /**
   * Get total item count for a room
   */
  getItemCount(room) {
    if (!room || !room.items) return 0;
    return room.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  },

  /**
   * Get total cost for a room
   */
  getTotalCost(room) {
    if (!room || !room.items) return 0;
    return room.items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
  }
};
