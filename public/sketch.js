// Open and connect input socket
let socket = io('/'); //don't think we need '/'

// Listen for confirmation of connection
socket.on('connect', function() {
  console.log("Connected");
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

/*
function playCard(card){
  socket.emit('card', card);
}

*/