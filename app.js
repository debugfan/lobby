const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const os = require('os');
const port = process.env.PORT || 3000;

var clients = {};

const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({storage: storage})

app.use('/uploads', express.static('uploads'));

app.get('/index.js', (req, res) => {
  res.sendFile(__dirname + '/index.js');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/upload', upload.single('file'), function (req, res, next) {
  res.send(req.file);
  io.emit('file message', `${clients[req.ip]}: `
    + `<a href="uploads/${req.file.filename}" target="_blank">`
    + `${req.file.originalname}</a>`);
})

io.on('connection', (socket) => {
  socket.on('nickname', msg => {
    var address = socket.handshake.address;
    clients[address] = msg;
    io.emit('chat message', `${clients[address]}(${address}) joined in`);
  });

  socket.on('chat message', msg => {
    var address = socket.handshake.address;
    io.emit('chat message', `${clients[address]}: ${msg}`);
  });
});

http.listen(port, () => {
  var ifaces = os.networkInterfaces();
  console.log(`Socket.IO server running at:`);
  Object.keys(ifaces).forEach(function (dev) {
    ifaces[dev].forEach(function (details) {
      if (details.family === 'IPv4') {
        console.log('  http://' + details.address + ':' + port);
      }
    });
  });
});
