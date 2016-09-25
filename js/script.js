var simon = new SimonSequence();

var is_strict = false; // strict mode
var sequence_playing = false; // identify when computer is playing its sequence
var winValue = 20; // value that the sequence must reach to win

// cached objects
var $length = $("#current-length span");
var $reset = $("#reset");
var $strictToggle = $("#strict-mode-toggle");

// sound effects
soundEffects = {
    sound0: new Audio("http://www.jetcityorange.com/musical-notes/A3-220.0.mp3"),
    sound1: new Audio("http://www.jetcityorange.com/musical-notes/C4-261.63.mp3"),
    sound2: new Audio("http://www.jetcityorange.com/musical-notes/E4-329.63.mp3"),
    sound3: new Audio("http://www.jetcityorange.com/musical-notes/D4-293.66.mp3")
};

console.log(simon.getSequence());


// helper functions
function updateLength(len) {
    $length.html(len);
}



// USER GAME LOGIC - this code takes care of validating user input, and playing
// the sound that each button makes when pressed. It is also responsible for
// evaluating wins, and resetting when game finishes/strict mode is on.
var position = 0;
$(".buttons button").mousedown(function() {

    // not allowed to do anything if the computer is playing the sequence
    if (sequence_playing) {
        return false;
    }

    var val = parseInt($(this).data("val")); // getting value of button pressed

    // sounds
    soundEffects["sound" + val].play();


});

$(".buttons button").mouseup(function() {

    // not allowed to do anything if the computer is playing the sequence
    if (sequence_playing) {
        return false;
    }

    var val = parseInt($(this).data("val")); // getting value of button pressed

    // playing for at least a hundredth of a second
    setTimeout(function () {
      soundEffects["sound" + val].pause();
      soundEffects["sound" + val].currentTime = 0;
    }, 100);

    // game logic - right or wrong
    if (is_strict) {
        if (simon.checkValue(val, position)) {
            console.log("correct!");
            position++;
        } else {
            console.log("wrong. try again.");
            $reset.click();
            position = 0;
        }
    } else {
        if (simon.checkValue(val, position)) {
            console.log("correct!");
            position++;
        } else {
            console.log("wrong. try again.");
            position = 0;
        }
    }

    // checking for wins
    if (position == winValue) {
        console.log("You've won! Play again.");
        $reset.click();
        position = 0;
        return;
    }

    // if we've reached the end of the sequence
    if (position == simon.getSequence().length) {
        simon.addToSequence();
        updateLength(simon.getSequence().length);
        console.log(simon.getSequence());
        position = 0;
    }
});


// Reset button which resets the game. Also works as an aid inside other functions
$reset.click(function() {
    simon.reset();
    updateLength(simon.getSequence().length);
    position = 0;
    console.log(simon.getSequence());
});

// toggle between strict mode and normal mode
$strictToggle.click(function() {
    is_strict = !is_strict;
    $reset.click();
    if (is_strict) {
        $(this).find("span").html("ON");
    } else {
        $(this).find("span").html("OFF");
    }
});


/*=====================================
DISPLAYING SEQUENCE FUNCTIONS
======================================*/

function playSequence(seq) {

    sequence_playing = true; // flag to avoid user pressing buttons
    seq_length = seq.length;
    counter = 0;

    var intID = setInterval(function() {

        soundEffects["sound" + counter].play();
        setTimeout(function() {
            soundEffects["sound" + counter].pause();
            soundEffects["sound" + counter].currentTime = 0;
        }, 300);

        counter++;

        // clearing interval once list has been iterated over
        if (counter == seq_length) {
            sequence_playing = false;
            clearInterval(intID);
        }

    }, 500);
}
