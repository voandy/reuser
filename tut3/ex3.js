    // global variables
    var guess;
    var ans;

    // get the value of the guess
    function getGuess(){
        guess = document.getElementById("guess").value;

        check(guess);
    }

    // get value of the answer
    function getAnswer(){
        ans = document.getElementById("answer").value;
    }


    /* ------------------------------------------------ */

    let gameState = {
        incorrectGuesses : [],
        remainingGuesses : 10
        };

    function setWord (word) {
        //set word to be guessed
    }
    function validate (guess) {
        //validate the input from the form (letter)
    }
    function check (guess) {
        //check if the guess is correct
        console.log(guess + "&" + ans);

        if(guess !== ans){
            alert("false");
        }
        else{
            alert("true");
        }
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