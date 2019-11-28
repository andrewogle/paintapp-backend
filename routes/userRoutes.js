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
