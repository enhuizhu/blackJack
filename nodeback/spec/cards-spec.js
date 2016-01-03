/**
* unit test for cards
**/
var cardObj = require("../modules/cards.js"),
	cards = null;

describe("test all the card function", function() {
	beforeEach(function() {
		cards = new cardObj();
	});

	it("test cards obj initial", function() {
		expect(cards.newCards.length).toBe(52);
	});

	it("test original cards", function() {
		var expectCards = ['bt1',
						  'bt2',
						  'bt3',
						  'bt4',
						  'bt5',
						  'bt6',
						  'bt7',
						  'bt8',
						  'bt9',
						  'bt10',
						  'bt11',
						  'bt12',
						  'bt13',
						  'rt1',
						  'rt2',
						  'rt3',
						  'rt4',
						  'rt5',
						  'rt6',
						  'rt7',
						  'rt8',
						  'rt9',
						  'rt10',
						  'rt11',
						  'rt12',
						  'rt13',
						  'rs1',
						  'rs2',
						  'rs3',
						  'rs4',
						  'rs5',
						  'rs6',
						  'rs7',
						  'rs8',
						  'rs9',
						  'rs10',
						  'rs11',
						  'rs12',
						  'rs13',
						  'bm1',
						  'bm2',
						  'bm3',
						  'bm4',
						  'bm5',
						  'bm6',
						  'bm7',
						  'bm8',
						  'bm9',
						  'bm10',
						  'bm11',
						  'bm12',
						  'bm13' ];
		var originalCards = cards.getOriginalCards();
		expect(originalCards).toEqual(expectCards);
	});

	it("test 52 random numbers", function() {
		expect(cards.generateFiftyTwoRandomNumbers().length).toBe(52);
	});	

	it("test function generate cards", function() {
		cards.generateNewCards();
	    expect(cards.newCards.length).toBe(52);

	    for(var i = 0; i < cards.newCards.length; i++) {
	    	for(var j = i + 1; j < cards.newCards.length; j++){
	    		if (cards.newCards[i] == cards.newCards[j]) {
	    			throw "it has duplicate cards";
	    		};
	    	}
	    }
	});

	it("test function of sending out cards", function() {
		expect(cards.sendOutCards(2).length).toBe(2);
		expect(cards.newCards.length).toBe(50);
	});

	it("test total value of cards", function() {
		expect(cards.getCardsTotalValue(["bt1","bt10"])).toBe(21);		
		expect(cards.getCardsTotalValue(["bt2","bt10"])).toBe(12);		
		expect(cards.getCardsTotalValue(["bt2","bt11"])).toBe(12);		
		expect(cards.getCardsTotalValue(["bt2","bt12"])).toBe(12);		
		expect(cards.getCardsTotalValue(["bt2","bt13"])).toBe(12);		
		expect(cards.getCardsTotalValue(["bt10","bt13"])).toBe(20);		
		expect(cards.getCardsTotalValue(["bt1","bt13"])).toBe(21);		
		expect(cards.getCardsTotalValue(["bt1","bt13","bt13"])).toBe(21);		
		expect(cards.getCardsTotalValue(["bt1","bt13","bt13","bt13"])).toBe(31);		
	});

	it("test banker hit or stand", function() {
		expect(cards.bankerHitOrStand(11,20)).toBe(false);
		expect(cards.bankerHitOrStand(11,11)).toBe(false);
		expect(cards.bankerHitOrStand(15,10)).toBe(true);
		expect(cards.bankerHitOrStand(10,10)).toBe(true);
		expect(cards.bankerHitOrStand(9,9)).toBe(true);
		expect(cards.bankerHitOrStand(19,17)).toBe(true);
		expect(cards.bankerHitOrStand(24,17)).toBe(false);
		expect(cards.bankerHitOrStand(26,17)).toBe(false);
	});

	it("test banker reset cards", function() {
		cards.newCards = [""]
		expect(cards.getRestBankerCards(["bt2","bt10"],["bt3","bt10"])).toEqual([]);
		
		cards.newCards = ["bt2","bt1","bt4"];
		expect(cards.getRestBankerCards(["bt5","bt10"],["bt3","bt10"])).toEqual(["bt4"]);

		cards.newCards = ["bt4","bt1","bt2"];
		expect(cards.getRestBankerCards(["bt5","bt10"],["bt3","bt10"])).toEqual(["bt2"]);

		cards.newCards = ["bt4","bt2","bt1"];
		expect(cards.getRestBankerCards(["bt5","bt10"],["bt3","bt10"])).toEqual(["bt1","bt2"]);

		cards.newCards = ["bt4","bt2","bt10"];
		expect(cards.getRestBankerCards(["bt5","bt10"],["bt3","bt10"])).toEqual(["bt10"]);

		cards.newCards = ["bt4","bt1","bt2","rt3","bt5"];
		expect(cards.getRestBankerCards(["bt12","bm9"],["rt4","rs5"])).toEqual(["bt5","rt3","bt2"]);

		cards.newCards = ["bt4","bt6","bt1","rt3","bt5"];
		expect(cards.getRestBankerCards(["bt12","bm9"],["rt4","rs5"])).toEqual(["bt5","rt3","bt1","bt6"]);
	});

	it("test player final state", function() {
		expect(cards.getPlayerFinalState(["bt2","bt10"],["bt3","bt10"])).toBe(0);
		expect(cards.getPlayerFinalState(["bt2","bt10"],["bt3","bt10","bt1"])).toBe(0);
		expect(cards.getPlayerFinalState(["bt2","bt10"],["bt3","bt10","bt1","bt2"])).toBe(0);
		expect(cards.getPlayerFinalState(["bt11","bt10"],["bt3","bt10","bt1","bt2"])).toBe(2);
		expect(cards.getPlayerFinalState(["bt9","bt10"],["bt3","bt10","bt1","bt2"])).toBe(2);
		expect(cards.getPlayerFinalState(["bt9","bt10"],["bt3","bt10","bt1","bt2","bt10"])).toBe(2);
	});

});
