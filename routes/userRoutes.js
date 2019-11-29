const express = require("express");
const http = require("http").Server(router);
const io = require("socket.io")(http);
const router = express.Router();
const Session = require("../sessions/session");

const sessions = {};

setInterval(() => {
  for (sessionKey in sessions) {
    const session = sessions[sessionKey];
    session.decrementTimer();
    if (session.getTimer() === 0) {
      delete sessions[sessionKey];
    }
  }
}, 1000);

const generateId = len => {
  let resualt = "";
  for (let i = 0; i < len; i++) {
    resualt += Math.floor(Math.random() * 10);
  }
  return resualt;
};

router.post("/createUser", (req, res) => {
  const sessionKey = generateId(24);
  sessions[sessionKey] = new Session(req.body.name);
  res.json({ success: true, sessionKey });
});

io.on("connection", socket => {
  setInterval(() => {
    const sessionKeys = Object.keys(sessions);
    const cursorPositions = [];
    for (let i = 0, n = sessionKeys.length; i < n; i++) {
      const key = sessionKeys[i];
      const session = sessions[key];
      cursorPositions.push({
        x: session.getMouseX(),
        y: session.getMouseY(),
        name: session.getName(),
        key: session.getName()
      });
    }

    socket.emit("cursor", cursorPositions);
  }, Math.round(1000 / 30));
  socket.on("cursor", data => {
    const session = sessions[data.sessionKey];
    session.resetTimer();
    session.setMouseX(data.x);
    session.setMouseY(data.y);
  });
  socket.on("line", data => {
    const session = sessions[data.sessionKey];
    const lineCoordinates = data.lineCoordinates;
    io.emit("line", {
      lineWidth: data.lineWidth,
      lineColor: data.lineColor,
      lineCoordinates
    });
  });
});

module.exports = router;
