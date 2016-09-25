

var simon = new SimonSequence();

var is_strict = true; // strict mode
var winValue = 5; // value that the sequence must reach to win

var $length = $("#current-length span");
var $reset = $("#reset");

console.log(simon.getSequence());

function updateLength(len) {
  $length.html(len);
}

var position = 0;
// takes care of checking click against sequence
$(".buttons button").click(function () {
  var val = parseInt($(this).attr("id")); // getting value of button pressed

  // game logic - right or wrong
  if (is_strict) {
    if (simon.checkValue(val, position)) {
      console.log("correct!");
      position++;
    } else {
      console.log("wrong. try again.");
      simon.reset();
      console.log(simon.getSequence());
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
    simon.reset();
    updateLength(simon.getSequence().length);
    console.log(simon.getSequence());
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

$reset.click(function () {
  simon.reset();
  updateLength(simon.getSequence().length);
  position = 0;
  console.log(simon.getSequence());
})
