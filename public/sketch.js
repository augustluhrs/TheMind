//"The Mind" 
//by Maya Pruitt, Noah Pivnick, August Luhrs
//for Collective Play "Waiting/Turns/Queuing" Assignment
//ITP Spring 2019 -- Mimi Yin
//based on "The Mind" card game by Wolfgang Warsch

// Open and connect input socket
let socket = io('/');

// Listen for confirmation of connection
socket.on('connect', function() {
  console.log("Player connected");
});

let cards = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  //Recieves the dealt hand at start of game
  socket.on('deal', function(cards) {
    //sets up cards[] and displays them
    //relative to screen size + amount
    //color gradient?
    //how do we want to make cards clickable?
    //card objects?
  });
  
  socket.on('reset', function(){
    //empties cards array and clears screen
  });

}

//do we want a concentration phase like in the rulebook?
//could have them all have to hold a button together to start (after getting dealt the cards)
//would need to add another layer of start to the server

function draw(){
  //drawCards();
}

/*function drawCards(){
  //draws all cards in cards[]
  //highlight ones played vs unplayed or just remove the played cards?
  //card mousePressed?
}

/*
function playCard(card){
  socket.emit('card', card);
}

*/