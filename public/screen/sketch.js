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
let cardsString = '';
let settings = {}; //holds the settings to be sent to the server
let gameStarted = false;
let lost = false; //can make this more elegant later
let won = false;

//settings elements
let settingDiv; //the div container thing (i suck at html so idk if this is redundant)
let startButt; //starts the game
//resetButt?
let levelSlider; //slider to set level of game
let levelText;
// let timerBox; //unlocks the timer slider
// let timerOn = false; //timer toggle
// let timer; //seconds left
// let timerSlider; //slider to set timelimit
// let blindBox; //checkbox to toggle blind mode

// display stuff

// Margin
let margin = 10;

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
  
  levelSlider = createSlider(1, 6, 1, 1) //max 6 to avoid over 100 issue
    .parent('settings');
  
  levelText = select('#level');
  startButt = createButton('START GAME')
    .parent('settings')
    .mousePressed(function(){
      updateSettings();
      // if(timeOn){timer = timerSlider.value();}
      gameStarted = true;
      socket.emit('start', settings);
      settingDiv.hide(); //hides settings and brings canvas up
    });
  //need to position this later
  
  
  // Listen for the next card being played
  socket.on('card', function (playedCard) {
    // Receives the next card to display
    cards.push(playedCard);
    console.log("Card: " + playedCard);
    cardsString += playedCard + ", ";
    //adds played card to end of cards[]
    drawCardsString();
    playCards(playedCard);
  });
  
  //listen for game over from server
  socket.on('fail', function (data) {
    lost = true;
    text('you lost', width/2, height/2);
    //if they play the wrong card, will display a game over msg
    //also unlocks the reset button, which takes them back to the
    //start screen
    rectMode(CENTER);
    fill(255, 0, 0);
    rect(width/2, height/2, width, height);
    fill(0);
    textAlign(CENTER);
    textSize(100);
    text('TRY AGAIN', width/2, height/2);
  });

}

function draw(){
  if (!gameStarted){ //settings and wait screen
    // levelText = levelSlider.value();
    levelText.html(levelSlider.value());
    // text("Level: " + levelText, 0, 0);
    //display anything?
    //just keeps the game from drawing while we set up
  } else {
    // background(155); //or whatever we want
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
    // timer: timerBox.value(),
    // timelength: timerSlider.value(),
    // blind: blindBox.value()
  }
}
/*
function timer(){

}
*/

 //different from player playCards()
function playCards(play){
  //in draw loop
  //stacks all played cards according to cards[]
  //should display the next card with a slight offset, to show layer
  //card color? + black stroke
  push();
  rectMode(CENTER);
  let randR = random(255);
  let randG = random(255);
  let randB = random(255);
  fill(randR, randG, randB);
  strokeWeight(14);
  stroke(0);
  let offsetX = random(-50, 50);
  let offsetY = random(-50, 50);
  
  rect(width/2 + offsetX, height/2 + offsetY, width-width/6, height-height/6);
  fill(0);
  noStroke();
  textSize(100);
  text(play, width/2+offsetX, height/2+offsetY);
  pop();
}



// Draw string, character by character

function drawCardsString() {

  // Start in upper left-hand corner
  let x = margin;
  let y = margin;
  fill(0);

    // Draw string, character by character
    for (let c = 0; c < cardsString.length; c++) {
      let char = cardsString.charAt(c);
      text(char, x, y);
      x += textWidth(char);
      // Wrap text to next line
      if (x > width - margin) {
        x = 0;
        y += textAscent('h') + textDescent('p');
      }
    }
}