var simon = new SimonSequence();

var is_strict = false; // strict mode
var playing = true; // identify when computer is playing its sequence
var winValue = 20; // value that the sequence must reach to win

// cached objects
var $length = $("#current-length");
var $reset = $("#reset");
var $strictToggle = $("#strict-mode-toggle");
var $notifications = $("#notifications");

// sound effects
soundEffects = {
    sound0: new Audio("sounds/button0.mp3"),
    sound1: new Audio("sounds/button1.mp3"),
    sound2: new Audio("sounds/button2.mp3"),
    sound3: new Audio("sounds/button3.mp3"),
    error: new Audio("sounds/error.mp3"),

    /*
    Title: Winning Triumphal Fanfare
    About: A brief victorious trumpet fanfare suitable for winning a game. big thanks to john stracke for posting this awesome sound!
    Uploaded: 05.27.11
    License: Attribution 3.0 (https://creativecommons.org/licenses/by/3.0/legalcode)
    Recorded by John Stracke
    */
    success: new Audio("sounds/success.mp3")
};


// helper functions
function updateLength(len) {
    $length.html(len);
}

function displayNotif(message) {
  $notifications.html(message);
  setTimeout(function () {
    $notifications.html("");
  }, 3000);
}

function playSound(sound, time) {
  soundEffects[sound].play();
  setTimeout(function () {
    soundEffects[sound].pause();
    soundEffects[sound].currentTime = 0;
  }, time);
}

function addColour(colorClass) {
  $("body").addClass(colorClass);
}

function removeColour(colorClass) {
  $("body").removeClass(colorClass);
}


// USER GAME LOGIC - this code takes care of validating user input, and playing
// the sound that each button makes when pressed. It is also responsible for
// evaluating wins, and resetting when game finishes/strict mode is on.
var position = 0;
$(".buttons button").click(function() {

    // not allowed to do anything if the computer is playing the sequence
    if (playing) {
        return false;
    }

    var val = parseInt($(this).data("val")); // getting value of button pressed

    soundEffects["sound" + val].play(); // starting sound

    $(this).addClass("active"); // adding visual class
    addColour("button" + val + "-colour"); // color for body and R

    playing = true; // to lock sound so that user can't destroy button with clicks
    // reference to be passed inside interval
    var $self = $(this);
    // playing for at least two hundredths of a second
    setTimeout(function () {
      soundEffects["sound" + val].pause();
      soundEffects["sound" + val].currentTime = 0;
      $self.removeClass("active");
      removeColour("button" + val + "-colour");
      playing = false;
    }, 300);

    // game logic - right or wrong
    if (is_strict) {
        if (simon.checkValue(val, position)) {
            position++;
        } else {
            displayNotif("Wrong. Try again.");
            playSound("error", 1000);
            $reset.click();
            position = 0;
        }
    } else {
        if (simon.checkValue(val, position)) {
            position++;
        } else {
            displayNotif("Wrong. Try again.");
            playSound("error", 1000);
            playSequence(simon.getSequence());
            position = 0;
        }
    }

    // checking for wins
    if (position == winValue) {
        displayNotif("You've won! Play again.");
        playSound("success", 4000);
        $reset.click();
        position = 0;
        return;
    }

    // if we've reached the end of the sequence
    if (position == simon.getSequence().length) {
        simon.addToSequence();
        var seq = simon.getSequence();
        updateLength(seq.length);
        playSequence(seq);
        position = 0;
    }
});

$(".buttons button").on("mouseup touchend", function() {


});


// Reset button which resets the game. Also works as an aid inside other functions
$reset.click(function() {
    simon.reset();
    var seq = simon.getSequence();
    updateLength(seq.length);
    position = 0;
    playSequence(seq);

    $(this).html("Reset");
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

  setTimeout(function () {
    playing = true; // flag to avoid user pressing buttons
    var seq_length = seq.length;
    var counter = 0;

    var intID = setInterval(function() {

        var val = seq[counter];

        soundEffects["sound" + val].play();
        var id = "#button" + val;
        $(id).addClass("active");
        addColour("button" + val + "-colour");
        setTimeout(function() {
            soundEffects["sound" + val].pause();
            soundEffects["sound" + val].currentTime = 0;
            $(id).removeClass("active");
            removeColour("button" + val + "-colour");
            counter++;
        }, 400);


        // clearing interval once list has been iterated over
        if (counter == seq_length - 1) {
            playing = false;
            clearInterval(intID);
        }

    }, 700);
  }, 500);

}
