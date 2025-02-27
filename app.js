const express = require("express");
const app = express();
const wsExpress = require("express-ws")(app);
const path = require("path");
const ChatUser = require("./chat-user");

app.use("/static", express.static(path.join(__dirname, "static")));

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.get("/:roomName", (req, res) => {
  res.sendFile(`${__dirname}/chat.html`);
});

app.ws("/chat/:roomName", (ws, req, res) => {
  try {
    const user = new ChatUser(
      ws.send.bind(ws), // fn to call to message this user
      req.params.roomName // name of room for user
    );
    ws.on("message", function (data) {
      try {
        user.handleMessage(data);
      } catch (err) {
        console.error(err);
      }
    });

    ws.on("close", function () {
      try {
        user.handleClose();
      } catch (err) {
        console.error(err);
      }
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = app;
