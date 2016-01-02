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

cards.prototype.getCardsTotalValue = function(cards) {
	var sum = 0,
		extra = []; // when the value of 1, it also can be 10 use this one to save the extra value
	
	_.each(cards, function(v, k) {
		try{
			var trueV = parseInt(v.substr(2));
		}catch(e){
			console.info("value is",v);
		}

		if (trueV > 10) {
			trueV = 10;
		};

		if (trueV == 1) {
			extra.push(9);
		};

		sum += trueV;
	});

	if (sum < 21) {
		var extraSum = _.reduce(extra, function(memo, num){ return memo + num; }, 0),
			totalSum = sum + extraSum;
		
		/**
		* should check if it's ace with another ten points
		**/
		if (totalSum == 20 && extra.length === 1 && cards.length == 2) {
			return 21;
		};

		if (totalSum <= 21) {
			return totalSum;
		};
	};

	return sum;
};

/**
* true means hit, false means stand
**/
cards.prototype.bankerHitOrStand = function(playerTotal, bankerTotal) {
	if (playerTotal == bankerTotal) {
		/**
		* should check the value of total, if total is less then 10, then we should ask for another card
		* if total is greater then 10, there is chance to lose then banker should not ask for another card
		**/
		if (playerTotal <= 10) {
			return true;
		};

		return false;
	};

	if (bankerTotal < playerTotal) {
		return true;
	};

	return false;
};

cards.prototype.getRestBankerCards = function(playerCards, bankerCards) {
	var playerTotal = this.getCardsTotalValue(playerCards),
		bankerTotal = this.getCardsTotalValue(bankerCards),
		resetCards = [],
		bankerCardsCopy = _.clone(bankerCards);

	while(this.bankerHitOrStand(playerTotal, bankerTotal)) {
		var newCard = this.sendOutCards(1);
		resetCards = resetCards.concat(newCard);
		bankerCardsCopy = bankerCardsCopy.concat(newCard);
		bankerTotal = this.getCardsTotalValue(bankerCardsCopy);
	}

	return resetCards;
};

cards.prototype.getPlayerFinalState = function(playerCards, bankerCards){
	var playerTotal = this.getCardsTotalValue(playerCards),
		bankerTotal = this.getCardsTotalValue(bankerCards);

	if (playerTotal > 21) {
		return 0;
	};

	if (bankerTotal > 21) {
		return 2;
	};

	if (playerTotal > bankerTotal) {
		return 2;
	};

	if (playerTotal == bankerTotal) {
		return 1;
	};

	if (playerTotal < bankerTotal) {
		return 0;
	};
};

