const app        = require('express')(),
      http       = require('http').Server(app),
      io         = require('socket.io')(http),
      bodyParser = require('body-parser'),
      cors       = require('cors');
      sess       = require('./sessions/session')
      func        = require('./helpers/helpers')

const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post('/create_user', (req, res) => {
  const sessionKey = func.generateId(24);
  sessions[sessionKey] = new Session(req.body.name);
  res.json({success: true, sessionKey});
});
const Session = sess.Session
const sessions = {};

func.countDown(sessions)

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
http.listen(port, () => console.log(`listening to port ${port}`));