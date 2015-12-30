/**
* unit test for cards
**/
var cardObj = require("../modules/cards.js"),
	cards = new cardObj();

describe("test all the card function", function() {
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
});
