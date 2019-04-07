//"The Mind" 
//by Maya Pruitt, Noah Pivnick, August Luhrs
//for Collective Play "Waiting/Turns/Queuing" Assignment
//ITP Spring 2019 -- Mimi Yin
//based on "The Mind" card game by Wolfgang Warsch


// Open and connect input socket
let socket = io('/players');

// Listen for confirmation of connection
socket.on('connect', function() {
  console.log("Player connected");
});

// an array to hold as many cards in a giv en player's hand (as few as 1)
let cards = [];
let cardButts = []; //array of buttons
let cardButt1, cardButt2;

function setup() {
  // createCanvas(windowWidth, windowHeight);
  
  //Recieves the dealt hand at start of game
  socket.on('deal', function(dealtCards) {
    //sets up cards[] and displays them
    cards = dealtCards;
    console.log('cards: ' + cards);
    // cardButt1.elt.textContent = cards[0];
    // cardButt2.elt.textContent = cards[1];
    
    // ughhhhhhhhhhh
    for (let i = 0; i < cards.length; i++){
      cardButts[i] = createButton(cards[i], i)
        .mousePressed(() => {
          // console.log(cardButts);
          let next = cardButts[i].elt.textContent;
          socket.emit('card', next);
          console.log(next);
          cardButts[i].hide();
        });
      cardButts[i].addClass('buttonStyle');
    }
  });
  
  socket.on('discard', function(discard){
    console.log('discard' + discard);
    for (let i = cardButts.length - 1; i >=0; i--){
      for (let j = discard.length - 1; j >=0; j--){
        if (cardButts[i].elt.outerText == discard[j]){
          cardButts[i].hide();
        }
      }
    }
  });
  
  socket.on('reset', function(){
    //empties cards array and clears screen
    console.log('reset');
    for (let i = cardButts.length - 1; i >=0; i--){
      cardButts[i].hide();
      // cardButts[i] = [];
    }
  });

}

//do we want a concentration phase like in the rulebook (http://j.mp/2WKYOCg)?
//could have them all have to hold a button together to start (after getting dealt the cards)
//would need to add another layer of start to the server

// function draw(){
//   drawCards();
// }