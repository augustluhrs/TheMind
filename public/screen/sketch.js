// Open and connect input socket
let socket = io('/screen');

// Listen for confirmation of connection
socket.on('connect', function() {
  console.log("Connected");
});

//game state stuff
let cnv; //canvas
let cards = [];
let settings = {};
let gameStarted = false;
let lost = false; //can make this more elegant later
let won = false;

//settings elements
let startButt; //starts the game
//resetButt?

function setup() {
  // cnv = createCanvas(windowWidth, windowHeight);
  createCanvas(windowWidth, windowHeight);
  
  startButt = createButton('START GAME');
  startButt.parent('canvas');
  startButt.mousePressed(function(){
    socket.emit('start', settings);
  });
  //need to position this later
  
  
  // Listen for the next card being played
  socket.on('card', function (data) {
    // Receives the next card to display
    console.log("Card: " + data);
    //adds played card to end of cards[]
  });
  
  //listen for game over from server
  socket.on('fail', function (data) {
    lost = true;
    //if they play the wrong card, will display a game over msg
    //also unlocks the reset button, which takes them back to the
    //start screen
  });

}

function draw(){
  if (!gameStarted){ //settings and wait screen
    
  } else {
    background(255); //or whatever we want
    playCards();
  }
}
/* different from player playCards f()
function playCards(){
  //in draw loop
  //stacks all played cards according to cards[]
  //should display the next card with a slight offset, to show layer
  //card color? + black stroke
}
*/