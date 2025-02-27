// CLIENT SIDE JS CODE!!!
const urlParts = document.URL.split("/");
const roomName = urlParts.at(-1);
const socket = new WebSocket(`ws://localhost:3000/chat/${roomName}`);

// Open websocket connection from the browser to the server

const username = prompt("Enter your username.  (no spaces)");
socket.onopen = (event) => {
  console.log("WEB SOCKET OPENED!");
  const data = { type: "join", name: username };
  socket.send(JSON.stringify(data));
};

socket.onmessage = (event) => {
  console.log("NEW MESSAGE,", event);
  let msg = JSON.parse(event.data);
  if (msg.type === "note") {
    const item = document.createElement("li");
    const text = document.createElement("i");
    text.textContent = msg.text;
    item.classList.add("info-text");
    item.appendChild(text);
    document.querySelector("#messages").appendChild(item);
  } else if (msg.type === "chat") {
    const item = document.createElement("li");
    const text = document.createElement("p");
    text.textContent = `${msg.name}: ${msg.text}`;
    if (username === msg.name) item.classList.add("self-mssg");
    else item.classList.add("other-mssg");
    item.appendChild(text);
    document.querySelector("#messages").appendChild(item);
  }
};

document.querySelector("#msg-form").addEventListener("submit", (event) => {
  event.preventDefault();
  console.log(event);
  const input = document.querySelector("#messageInput");
  const payload = { type: "chat", text: input.value };
  socket.send(JSON.stringify(payload));
  input.value = "";
});
