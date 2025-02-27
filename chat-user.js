const Room = require("./room");

class ChatUser {
  constructor(send, roomName) {
    this._send = send;
    this.room = Room.get(roomName);
    this.name = null;
  }

  send(data) {
    try {
      this._send(data);
    } catch {}
  }

  handleMessage(jsonData) {
    let msg = JSON.parse(jsonData);
    console.log(msg);

    if (msg.type === "join") this.handleJoin(msg.name);
    else if (msg.type === "chat") this.handleChat(msg.text);
    else if (msg.type === "get-members") this.handleGetMembers();
    else if (msg.type === "change-username")
      this.handleChangeUsername(msg.text);
    else throw new Error(`bad message: ${msg.type}`);
  }

  handleJoin(name) {
    this.name = name;
    this.room.join(this);
    this.room.broadcast({
      type: "note",
      text: `${this.name} joined "${this.room.name}".`,
    });
  }

  handleChat(text) {
    this.room.broadcast({
      name: this.name,
      type: "chat",
      text: text,
    });
  }

  handleClose() {
    this.room.leave(this);
    this.room.broadcast({
      type: "note",
      text: `${this.name} left ${this.room.name}.`,
    });
  }

  handleGetMembers() {
    // members is a Set of user instances
    const members = this.room.getMembers();
    const memberNames = [];

    for (let member of members) {
      memberNames.push(member.name);
    }

    this.send(
      JSON.stringify({
        name: "In room",
        type: "chat",
        text: memberNames.join(", "),
      })
    );
  }

  changeUsername(username) {
    this.name = username;
  }

  handleChangeUsername(username) {
    const currentName = this.name;
    this.changeUsername(username);
    const updatedName = this.name;

    this.room.broadcast({
      name: "server",
      type: "chat",
      text: `The username for ${currentName} has changed to ${updatedName}`,
    });
  }
}

module.exports = ChatUser;
