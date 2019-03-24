(function() {
"use strict";

var hiddenWord;
var wordLength;

var tiles = document.getElementById('wordTiles')

var incorrectCount = document.getElementById('incorrectCount');
var remainingCount = document.getElementById('remainingCount');

let gameState = {
  incorrectGuesses : [],
  correctGuesses : 0,
  remainingGuesses : 10,
  won : false
};

// starts or restarts the game when user clicks 'set word' button
document.getElementById("set-word").addEventListener("click", starGame);

function starGame(event) {
  // stops page refreshing as soon as game has started
  event.preventDefault()

  // reset gameboard
  reset();

  // gets word to be guessed
  hiddenWord = prompt("Enter your secret word.");
  hiddenWord = hiddenWord.toUpperCase();
  wordLength = hiddenWord.length;

  // sets up word tiles
  for(var i=0; i<wordLength; i++){
    // adds hidden tiles as well as giving them ids for easy access
    tiles.innerHTML += "<div class='char' id=letter" + i + ">"  + "?" + "</div>";
  }
}

// listens for guesses
document.getElementById('word-game').addEventListener("submit", makeGuess);

function makeGuess(event) {
  // stops page refreshing as soon as game has started
  event.preventDefault()

  // gets input
  var input = document.getElementById('guess-id').value.toUpperCase();

  // check guess if input is valid
  if (isValid(input)) {
    check(input);
  }

  // clear form
  document.getElementById('guess-id').value = '';
}

function isValid (guess) {
  //validate the input from the form (letter)
  var letters = /^[A-Za-z]+$/;

  if(!guess.match(letters) || (guess.length != 1)) {
    alert('Please enter a single alphabetical character.')
    return false;
  } else if (gameState.incorrectGuesses.includes(guess)) {
    alert("You've already guessed this letter dumbass!")
    return false;
  } else {
    return true;
  }
}

function check (guess) {
  //check if the guess is correct
  for (var i=0; i<wordLength; i++) {
    if (hiddenWord.charAt(i) == guess) {
      updateWordTiles(i);
      // increment correctGuesses
      gameState.correctGuesses ++;
    }
  }

  // update game state
  gameState.incorrectGuesses.push(guess);
  gameState.remainingGuesses -=1;

  // updates displayed state values with leading 0s
  incorrectCount.innerText = gameState.incorrectGuesses.length.pad(3);
  remainingCount.innerText = gameState.remainingGuesses.pad(3);

  // checks to see if the game is over
  checkEndOfGame();
}

// https://gist.github.com/endel/321925f6cafa25bbfbde
// pads number with leading 0s
Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
}

function updateWordTiles (index) {
  // reveal a tile upon correct guess
  var id = "letter" + index;
  var letter = hiddenWord.charAt(index);
  document.getElementById(id).innerText = letter;
}

function checkEndOfGame(){
  //check if the player has guessed the secret word or if the game is over (no more
  //remaining guesses

  // if all letters have been correctly guess you win
  if (gameState.correctGuesses == wordLength) {
    alert('YOU WIN - THE WORD IS ' + hiddenWord);
    reset();
  }

  // if remaining guesses is 0 you lose
  if (gameState.remainingGuesses == 0) {
    alert('YOU LOSE - THE WORD IS ' + hiddenWord);
    reset();
  }
}

function reset () {
  // resets game state
  gameState.incorrectGuesses = [];
  gameState.correctGuesses = 0;
  gameState.remainingGuesses = 10;

  // resets word tiles to empty
  tiles.innerHTML = '';
  document.getElementById('incorrectCount').innerText = "000";
  document.getElementById('remainingCount').innerText = "000";

}

})();
