    // global variables
    var guess;
    var ans;
    var i=0;

    // get the value of the guess
    function getGuess(){
        guess = document.getElementById("guess").value;
        check(guess);
    }

    // get value of the answer
    function getAnswer(){
        ans = document.getElementById("answer").value;

        console.log("answer is = " + ans);
    }

/* ------------------------------------------------ */

    let gameState = {
        incorrectGuesses : [],
        remainingGuesses : 10
        };

    /* check if the guess is correct */
    function check (guess) {

        let index = 0;
        gameState.remainingGuesses --;

        // correct answer
        if (ans === guess){
            index = 1;
            alert("you win ! the answer was -> " + ans);
        }      
        // false answer (no matches)
        else if(! ans.includes(guess)){
            // reduce chance
            gameState.incorrectGuesses.push(guess);
            index = 0;

            i++
        }
        // matching letters
        else{
            index = 1;
        }

        updateWordTiles(index);
    }

    /* update certain elements in the html */
    function updateWordTiles (index) {

        // correct guess
        if(index == 1){
            document.getElementById("chanceLeft").innerHTML = "00"+gameState.remainingGuesses;

            addCorrectLetters(guess);
        }
        // incorrect guess
        else {
            document.getElementById("wrong").innerHTML = "00"+gameState.incorrectGuesses.length;
            document.getElementById("chanceLeft").innerHTML = "00"+gameState.remainingGuesses;

            addGuessedWords();
        }

        // after 10 tries
        if(gameState.remainingGuesses <= 0){
            checkEndOfGame();
        }
    }

    /* add the letters according to their position */
    function addCorrectLetters(letter){
        
        document.getElementById("theWord").innerHTML = letter;
    }

    /* check if the player has guessed the secret word or if the game is over (no more
     * remaining guesses */
    function checkEndOfGame(){

        document.getElementById("wrong").innerHTML = "010"; 
        alert("you lost! the word is -> " + ans);
    }

    /* add a list of guessed words */    
    function addGuessedWords () {
        document.getElementById("guessedWords").innerHTML = "incorrect letters -> "+ gameState.incorrectGuesses;
    }