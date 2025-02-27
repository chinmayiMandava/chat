const rooms = new Map();

class Room {
  constructor(roomName) {
    this.name = roomName;
    this.members = new Set();
  }

  join(member) {
    this.members.add(member);
  }

  leave(member) {
    this.members.delete(member);
  }

  static get(roomName) {
    if (!rooms.has(roomName)) {
      rooms.set(roomName, new Room(roomName));
    }
    return rooms.get(roomName);
  }

  broadcast(message) {
    let data = JSON.stringify(message);
    for (let member of this.members) {
      member.send(data);
    }
  }

  getMembers() {
    return this.members;
  }

  getMember(name) {
    for (let member of this.members) {
      if (member.name === name) return member;
    }
  }
}

module.exports = Room;
