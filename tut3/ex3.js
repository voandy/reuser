
let gameState = {
    incorrectGuesses : [],
    remainingGuesses : 10
    };
    function setWord (word) {
        //set word to be guessed
            
        var ans = document.getElementById("answer").value;
        
        document.getElementById("theword").innerHTML = ans;
    }
    function validate (guess) {
    //validate the input from the form (letter)
    }
    function check (guess) {
    //check if the guess is correct
    }
    function updateWordTiles (index) {
    //update the tiles on the HTML
    }
    function checkEndOfGame(){
    //check if the player has guessed the secret word or if the game is over (no more
    //remaining guesses
    }
    function reset () {
    //reset the game (set new word to be guessed, clean word tiles, incorrect
    //guesses and remaining guesses
    }


function getGuess(){

    alert("Hello There");
}

function getAnswer(){

}