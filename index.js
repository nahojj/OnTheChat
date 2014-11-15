var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

app.use(express.static(__dirname + '/public/'));

// Usernames currently connected
var usernames = {};
var currentUser = 0;

io.on('connection', function(socket) {
  var addedUser = false;

   // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {

    // we store the username in the socket session for this client
    socket.username = username;

    // add the client's username to the global list
    usernames[username] = username;
    ++currentUser;
    addedUser = true;
    socket.emit('login', {
      currentUser: currentUser
    });

    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      currentUser: currentUser
    });
  });

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

   socket.on('disconnect', function () {
    // remove the username from global usernames list
    if (addedUser) {
      delete usernames[socket.username];
      --currentUser;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        currentUser: currentUser
      });
    }
  });

});
