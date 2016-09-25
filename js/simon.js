
function SimonSequence(range) {

  var self = this; // reference

  this.sequence = []; // sequence of numbers representing colours
  this.range =  (range !== undefined) ? range : 4;

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  this.addToSequence = function () {
    var randInt = getRandomInt(0, self.range);
    self.sequence.push(randInt);
  }

  this.getSequence = function () {
    return self.sequence;
  }

  this.reset = function () {
    self.sequence = [];
    self.addToSequence();
  }

  this.checkValue = function (val, pos) {
    if (val == self.sequence[pos]) {
      return true;
    } else {
      return false;
    }
  }

  this.init = function () {
    self.addToSequence();
  }

  this.init(); // initializing
}
