//"The Mind" 
//by Maya Pruitt, Noah Pivnick, August Luhrs
//for Collective Play "Waiting/Turns/Queuing" Assignment
//ITP Spring 2019 -- Mimi Yin
//based on "The Mind" card game by Wolfgang Warsch


// Create server
let port = process.env.PORT || 8000;
let express = require('express');
let app = express();
let server = require('http').createServer(app).listen(port, function () {
  console.log('Server listening at port: ', port);
});

// Tell server where to look for files
app.use(express.static('public'));

// Create socket connection
let io = require('socket.io').listen(server);

// Keep track of all connected players
let queue = [];
//settings from start screen
let settings = {};

//player sockets
let players = io.of('/');
players.on('connection',
  // Callback function on connection
  // Comes back with a socket object
  function (socket) {

    console.log("We have a new player: " + socket.id);

    // Add socket to queue
    queue.push(socket);

  
    // Listen for card messages from players
    socket.on('card', function (data) {
      // Receives the next card to display
      console.log("Card: " + data);
      // ***
      //takes the card value and checks it against the next element in the
      //game array, if it's correct, sends the card to the screen and 
      //updates the game array by incrementing the counter (could also splice)
      //if it's wrong, sends the fail message which unlocks reset
    });

    // Listen for this client to disconnect
    // Tell everyone client has disconnected
    socket.on('disconnect', function() {
      io.sockets.emit('disconnected', socket.id);

      // Remove socket from player queue
      for(let s = queue.length - 1; s >= 0; s--) {
        if(queue[s].id == socket.id) {
          queue.splice(s, 1);
        }
      }
    });
  });

// screen socket
let screen = io.of('/screen');
screen.on('connection',
  function (socket) {
    console.log("Screen has connected: " + socket.id);

    //when the screen sets up the game and presses start
    socket.on('start', function(startSettings) {
      //sets the variables according to the settings
      settings = startSettings;
      //initializes the game array by removing cards
      //copies the game array to a deck, then deals out cards (emit 'deal')
      //randomly to each player according to slot in the queue
      //if timer, starts it
    });

    // Listen for the screen to disconnect
    socket.on('disconnect', function() {
      io.sockets.emit('disconnected', socket.id);
      console.log("screen has disconnected");
      //should have a reset function that resets everything and emits
      //a blank slate to all players
    });
  });