//"The Mind" 
//by Maya Pruitt, Noah Pivnick, August Luhrs
//for Collective Play "Waiting/Turns/Queuing" Assignment
//ITP Spring 2019 -- Mimi Yin
//based on "The Mind" card game by Wolfgang Warsch
//http://middys.nsv.de/wp-content/uploads/2018/01/TheMind_GB.pdf

// Open and connect input socket
let socket = io('/screen');

// Listen for confirmation of connection
socket.on('connect', function() {
  console.log("Screen connected");
});

//game state stuff
let cnv; //canvas
let cards = []; //holds all received cards
let settings = {}; //holds the settings to be sent to the server
let gameStarted = false;
let lost = false; //can make this more elegant later
let won = false;

//settings elements
let settingDiv; //the div container thing (i suck at html so idk if this is redundant)
let startButt; //starts the game
//resetButt?
let levelSlider; //slider to set level of game
let timerBox; //unlocks the timer slider
let timerOn = false; //timer toggle
let timer; //seconds left
let timerSlider; //slider to set timelimit
let blindBox; //checkbox to toggle blind mode

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent('canvasContainer');
  // createCanvas(windowWidth, windowHeight);
  
  settingDiv = createDiv('SETTINGS:')
    .parent('settingsContainer')
    .id('settings');
  
  //settings elements:
  //
  //level (1-12)
  //timer
  //blind
  //ultimate mode (goes through 1-12 in order) //only if we have time
  
  startButt = createButton('START GAME')
    .parent('settings')
    .mousePressed(function(){
      updateSettings();
      if(timeOn){timer = timerSlider.value();}
      socket.emit('start', settings);
      settingDiv.hide(); //hides settings and brings canvas up
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
    //display anything?
    //just keeps the game from drawing while we set up
  } else {
    background(255); //or whatever we want
    playCards();
    /*
    if (timerOn){
      timer();
    }
    */
  }
}

function updateSettings(){
  settings = { //makes sense to put this in the startButtpress right? could also be anon
    level: levelSlider.value(),
    timer: timerBox.value(),
    timelength: timerSlider.value(),
    blind: blindBox.value()
  }
}
/*
function timer(){

}
*/

/* different from player playCards()
function playCards(){
  //in draw loop
  //stacks all played cards according to cards[]
  //should display the next card with a slight offset, to show layer
  //card color? + black stroke
}
*/