// require('dotenv').config();
// const server = require("./server");

// const port = process.env.PORT || 5000;


// server.listen(port, () => console.log(`listening to port ${port}`));

const app        = require('express')(),
      http       = require('http').Server(app),
      io         = require('socket.io')(http),
      bodyParser = require('body-parser'),
      cors       = require('cors');
      sess       =require('./sessions/session')

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post('/create_user', (req, res) => {
  const sessionKey = generateId(24);
  sessions[sessionKey] = new Session(req.body.name);
  res.json({success: true, sessionKey});
});
const Session = sess.Session
const sessions = {};

setInterval(() => {
  for(sessionKey in sessions) {
    const session = sessions[sessionKey];
    session.decrementTimer();
    if(session.getTimer() === 0) {
      delete sessions[sessionKey];
    }
  }
}, 1000);


function generateId(len) {
  let result = "";
  for(let i = 0; i < len; i ++) {
     result += Math.floor(Math.random() * 10);
  }
  return result;
}
console.log("this spot too: ", sessions)
io.on('connection', socket => {
  setInterval(() => {
    const sessionKeys = Object.keys(sessions);
    const cursorPositions = [];
    for(let i = 0, n = sessionKeys.length; i < n; i ++) {
      const key = sessionKeys[i];
      const session = sessions[key];

     
      cursorPositions.push({
        x:    session.getMouseX(),
        y:    session.getMouseY(),
        name: session.getName(),
        key: session.getName()
      });
    }

    socket.emit('cursor', cursorPositions);
  }, Math.round(1000/30));
    socket.on('cursor', data => {
      const session = sessions[data.sessionKey];
      console.log("right here: ",sessions[data.sessionKey])
      session.resetTimer();
      session.setMouseX(data.x);
      session.setMouseY(data.y);
    });
    socket.on('line', data => {
      const session = sessions[data.sessionKey];
      const lineCoordinates = data.lineCoordinates;
      io.emit('line', { 
          lineWidth: data.lineWidth,
          lineColor: data.lineColor,
          lineCoordinates
      });
    });
});
http.listen(8080, () => {
    //When the server is initialized.
});