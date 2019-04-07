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

//settings elements
let settingDiv; //the div container thing (i suck at html so idk if this is redundant)
let startButt; //starts the game
let spaceP; //complicated way of spacing...

//resetButt?

//slider to set level of game
let levelSlider, levelDiv, levelP, levelSpan; 
let levelText; //html

//sets lives per round
let livesBox, livesDiv, livesP, livesSpan, livesSlider, lives;
let livesOn = false;

// let timerBox; //unlocks the timer slider
// let timerOn = false; //timer toggle
// let timer; //seconds left
// let timerSlider; //slider to set timelimit

//blind mode
let blindBox; //checkbox to toggle blind mode
let blindMode = false; 

// Margin
let margin = 10;

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent('canvasContainer');
  
  rectMode(CENTER);
  textAlign(CENTER);
  
  settingDiv = createDiv('SETTINGS:')
    .parent('settingsContainer')
    .id('settings');
  
  //settings elements:
  //
  //level (1-12)
  //timer
  //blind
  //lives
  //ultimate mode (goes through 1-12 in order) //only if we have time
  
  //position all this later
  
  
  //complicated line break
  createP(' ')
    .parent('settings');
  createP(' ')
    .parent('settings');
  
  //level settings
  levelDiv = createDiv('')
    .id('levels')
    .parent('settings');
  levelP = createP('Level: ')
    .parent('levels');
  levelSpan = createSpan('')
    .id('levelSpan')
    .parent('levels');
  levelSlider = createSlider(1, 6, 1, 1) //max 6 to avoid over 100 issue
    .parent('settings');
  // levelText = select('#level');
  
  //complicated line break
  createP(' ')
    .parent('settings');
  createP(' ')
    .parent('settings');
  
  //lives settings
  livesBox = createCheckbox('Play with Lives?', false)
    .parent('settings')
    .changed(function(){
      if (this.checked()){
        livesDiv.show();
        livesOn = true;
      } else {
        livesDiv.hide();
        livesOn = false;
      }
    });
  livesDiv = createDiv('')
    .id('lives')
    .parent('settings');
  livesP = createP('Lives: ')
    .parent('lives');
  livesSpan = createSpan('')
    .id('livesSpan')
    .parent('lives');
  livesSlider = createSlider(1, 20, 5, 1)
    .parent('lives');
  livesDiv.hide();
  
  //complicated line break
  createP(' ')
    .parent('settings');
  createP(' ')
    .parent('settings');
  
  //blind settings
  blindBox = createCheckbox('Blind mode?', false)
    .parent('settings')
    .changed(function(){
      if(this.checked()){
        blindMode = true;
      } else {
        blindMode = false;
      }
    });
  
  //complicated line break
  createP(' ')
    .parent('settings');
  createP(' ')
    .parent('settings');
  
  //start button
  startButt = createButton('START GAME')
    .parent('settings')
    .mousePressed(function(){
      updateSettings();
      // if(timeOn){timer = timerSlider.value();}
      gameStarted = true;
      console.log(settings);
      socket.emit('start', settings);
      settingDiv.hide(); //hides settings and brings canvas up
    });
  
  
  // Listen for the next card being played
  socket.on('card', function (playedCard) {
    // Receives the next card to display
    console.log("Card: " + playedCard);
    
    //for test display
    // cardsString += playedCard + ", ";
    // drawCardsString();
    
    //adds played card to end of cards[]
    cards.push(playedCard);
    playCards(playedCard);
  });
  
  //listen for win from server
  socket.on('win', function(){
    fill(0, 255, 0);
    rect(width/2, height/2, width, height);
    strokeWeight(5);
    stroke(0);
    fill(255);
    textSize(height/7);
    text('WE WIN!', width/2, height/2);
  });
  
  //listen for game over from server
  socket.on('fail', function(howbad){
    //if they play the wrong card, will deduct lives or display a game over msg
    if (livesOn){
      lives = howbad.updatedLives;
      console.log(howbad.lose);
      if (howbad.lose == true) {
        fill(255, 0, 0);
        rect(width/2, height/2, width, height);
        fill(0);
        textSize(height/7);
        text('TRY AGAIN', width/2, height/2);
      }
    } else {
        fill(255, 0, 0);
        rect(width/2, height/2, width, height);
        fill(0);
        textSize(height/7);
        text('TRY AGAIN', width/2, height/2);
    }
  });
  
  //if all cards are gone but they still have lives left
  socket.on('kindaFail', function(){
      fill(200, 0, 50);
      rect(width/2, height/2, width, height);
      fill(0);
      textSize(height/20);
      text('RAN OUT OF CARDS', width/2, height/2);
  });
}

function draw(){
  if (!gameStarted){ //settings and wait screen
    levelSpan.html(levelSlider.value());
    livesSpan.html(livesSlider.value());
    //display anything?
  } else {
    if (livesOn){
      fill(205, 155, 0);
      rect(width/2, height/50, width/2, height/10);
      strokeWeight(4);
      stroke(255);
      fill(0);
      textSize(height/15);
      text("LIVES: " + lives, width/2, height/19);
    }
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
    livesOn: livesOn,
    lives: livesSlider.value(),
    blind: blindMode
  }
  lives = livesSlider.value();
}
/*
function timer(){

}
*/

//different from player playCards()
function playCards(play){
  //stacks all played cards according to cards[]
  //should display the next card with a slight offset, to show layer
  //card color? + black stroke
  push();
  //card rect
  let randR = random(255);
  let randG = random(255);
  let randB = random(255);
  fill(randR, randG, randB);
  strokeWeight(14);
  stroke(0);
  let rand = height/7;
  let offsetX = random(-rand, rand);
  let offsetY = random(-rand, rand);
  rect(width/2 + offsetX, height/2 + offsetY, width-width/6, height-height/6);
  
  //card number
  //if not blind, displays card
  if (!blindMode){
     //invert color if dark card back
    if (((randR + randG + randB) / 3) < 120){
      fill(255);
    } else {
      fill(0);
    }
    noStroke();
    textSize(height/5);
    text(play, width/2+offsetX, height/2+offsetY);
  }
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