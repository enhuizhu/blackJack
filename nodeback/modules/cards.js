/**
* cards module
**/
module.exports = cards;

var _ = require("underscore");
var prefixs = ["bt","rt","rs","bm"];

function cards(){
	this.newCards = [];
	this.originalCards = this.getOriginalCards();
	this.generateNewCards();
};

cards.prototype.getOriginalCards = function() {
	var cardsArr = [];
	
	_.each(prefixs, function(v, k) {
		for (var i = 1; i <= 13; i++) {
			cardsArr.push(v+i);
		};
	});

	return cardsArr;
};

cards.prototype.generateFiftyTwoRandomNumbers = function() {
	var numbers = [],
		randomNumbers = [];

	for(var i=0; i<52; i++) {
		numbers.push(i)
	};

	while(numbers.length) {
		var randomNumber = Math.round(Math.random() * (numbers.length - 1));
		randomNumbers.push(numbers[randomNumber]);
		numbers.splice(randomNumber,1);
	};

	return randomNumbers;
};

cards.prototype.generateNewCards = function() {
	var randomNumbers = this.generateFiftyTwoRandomNumbers();
	this.newCards = []
	
	for (var i = 0; i < randomNumbers.length; i++) {
		this.newCards.push(this.originalCards[randomNumbers[i]]);
	};
};

cards.prototype.sendOutCards = function(numbers) {
	var popedCards = [];

	for (var i = 0; i < numbers; i++) {
		popedCards.push(this.newCards.pop());
	};

	return popedCards;
};
