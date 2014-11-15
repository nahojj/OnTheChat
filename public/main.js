$(function() {
  // TODO: Dekilera varbs för elementen på sidan.
  var messages  = [];
  var socket    = io.connect('http://onthechat.johanjohansson.me:3000');
  var chatElem = $('#chatter');
  var messageInput = $('#send');
  var userInput = $('#username');
  var username;

  var markUp = $('.table-container');

  // TODO: Skapa en funktion som skickar ut meddelandet.
  function addMessage(data) {
    if (data.message) {
      var usernameElem  = '<span class="username">'+ data.username +':</span>';
      var messageElem   = '<span class="user-message">'+ data.message +'</span>';
      var contentElem   = $('<div class="message">').append(usernameElem,messageElem);
      addChatElement(contentElem);
    }
  };

  function addChatElement(elem) {
    console.log(elem);

    var elem = $(elem);
    chatElem.append(elem);
  };

  function sendMessage() {
    var message = messageInput.val();
    // Om message finns, skicka.
    if (message) {
      messageInput.val('');
      addMessage({
        username: username,
        message: message
      });
      socket.emit('new message', message);
    }

  };

  function addUser() {
    username = userInput.val();

    if (username) {
      socket.emit('add user', username);
       chatElem.show();
       userInput.hide();
       markUp.hide();
    }
  };

  function currentUsers (data) {
    var message = '';
    if (data.currentUser === 1) {
      message += "<ul class=\"chat-message\"><li>There's only 1 user currently online</li></ul>";
    } else {
      message +="<ul class=\"chat-message\"><li>There are currently " + data.currentUser + ' users online</li></ul>';
    }
    chatElem.append(message);
  }

  // TODO: Socket.on funktioner
  //skickar meddelanden till servern.
  socket.on('new message', function(data) {
    addMessage(data);
  });

  socket.on('user joined', function(data) {
    console.log(data.username);
    var message = '';
    message += "<ul class=\"chat-message\"><li>" + data.username + ' is now conntected </li></ul>';
    chatElem.append(message);
    currentUsers(data);
  });

  socket.on('user left', function(data) {
    var message = '';
    message += "<ul class=\"chat-message\"><li>" + data.username + ' disconnetcted </li></ul>';

    chatElem.append(message);
    currentUsers(data);
  });


  // TODO: skickar meddelandet när vi trycker på enter
  messageInput.keypress(function(event) {
    if (!event) {
      event = window.event;
    }

    if (event.which == 13) {
      sendMessage();
      return false;
    }
  });

  userInput.keypress(function(event) {
    if (!event) {
      event = window.event;
    }

    if (event.which == 13) {
      addUser();
      return false;

      socket.emit('user joined', username);
    }
  });
});
