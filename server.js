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
//card decks
let deck = []; //the whole deck of cards
let cards = []; //the cards we're playing with
let playerCards = []; //the hands

//player sockets
let players = io.of('/players'); //had to change because was counting screen as player
players.on('connection',
  // Callback function on connection
  // Comes back with a socket object
  function (socket) {

    console.log("We have a new player: " + socket.id);

    // Add socket to queue
    queue.push(socket);

  
    // Listen for card messages from players
    socket.on('card', function (playedCard) {
      // Receives the next card to display
      console.log("Card just played: " + playedCard);
      //for now, just sends to screen
      // screen.emit('card', playedCard);
      //takes the card value and checks it against the next element in the
      //game array, if it's correct, sends the card to the screen and 
      //updates the game array by incrementing the counter (could also splice)
      //if it's wrong, sends the fail message which unlocks reset
      if (playedCard == cards[0]){ //if it matches the next card
        // console.log('0th card ' + cards[0]);
        screen.emit('card', playedCard);
        cards.splice(0, 1);
      } else { //on fail
        // console.log('cards' + cards);
        // console.log('0th card' + cards[0]);
        screen.emit('fail');
      }
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
      //hard code the settings just for first test
      let level = settings.level;
      //set up the deck array 1 - 100
      for (let i = 1; i <= 100; i++){
        deck.push(i);
      }
      //initializes the cards array by removing numbers from the deck
      //need to have some sort of modulo magic for dealing with >100 cards
      for (let i = 0; i < level; i++){
        for (let j = queue.length - 1; j >= 0; j--){
          let r = Math.floor(Math.random() * Math.floor(deck.length-1));
          // let r = Math.floor(random(deck.length-1));
          // console.log(r);
          cards.push(deck[r]);
          deck.splice(r, 1);
        }
      }
      // console.log("deck " + deck);
      //sorts the game array
      cards = cards.sort(function(a, b){return a - b});
      console.log("sorted cards " + cards);
      
      //then deals out cards (emit 'deal') randomly to each player according to slot in the queue
      //for each player in the queue
      let dupeCards = [];
      for (i = cards.length - 1; i >=0; i--){
        dupeCards[i] = cards[i];
      }
      // let dupeCards = cards;
      // console.log('cards array after creating dupe: ' + cards);
      // console.log('dupe array after creating dupe: ' + dupeCards);
      
      for (i = queue.length -1; i >= 0; i--){
        //sets up nested arrays for the player hands
        // playerCards[i] = [];
        let hand = [];
        for (j = 0; j < level; j++){
          //take a random element from cards
          let r = Math.floor(Math.random() * Math.floor(dupeCards.length-1));
          hand.push(dupeCards[r]);
          dupeCards.splice(r, 1);
        }
        console.log(hand);
        hand = hand.sort(function(a, b){return a - b});
        playerCards[i] = hand;
      }
      //now send each hand to the appropriate player
      for (i = queue.length -1; i >= 0; i--){
        console.log("playerCards :" + playerCards[i]);
        let current = queue[i];
        current.emit('deal', playerCards[i]);
      }
      console.log('after after after' + cards);
      
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