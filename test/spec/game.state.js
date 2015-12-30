/**
* test game state
**/
describe("game state", function() {
	function createStage() {
		var domStr = '<div class="chipContainer">'+
			    '<span class="chipIcon chipFive fristLeft"></span>'+
			    '<span class="chipIcon chipTen"></span>'+
			    '<span class="chipIcon chipTwentyFive active"></span>'+
			    '<span class="chipIcon chipFifty"></span>'+
			    '<span class="chipIcon chipHundread"></span>'+
			'</div>'+
			'<div class="controllIcon newGame"></div>'+
			'<div class="controllIcon deal"></div>'+
			'<div class="controllIcon undo"></div>'+
			'<div class="controllIcon stand"></div>'+
			'<div class="controllIcon hit"></div>'+
			'<div class="controllIcon rebet"></div>'+
			'<div class="controllIcon double"></div>'+
			'<div class="controllIcon clearChip"></div>'+
			'<div class="controllIcon doubleRebet"></div>'

		var div = document.createElement("div");

		div.id = "gameStage";
		div.class= "gameStage";
		div.innerHTML = domStr;
		
		document.body.appendChild(div);
		
		// jQuery("#gameStage").append(domStr);
	};

	beforeEach(function() {
		createStage();
		game.state.init();
	});

	it("game state map view class", function() {
		expect(game.state.getStageClass("NEW")).toBe("new-game");
		expect(game.state.getStageClass("NEW_WITH_HISTORY")).toBe("new-game-with-history");
		expect(game.state.getStageClass("WAITING_FOR_BET")).toBe("waiting-for-bet");
		expect(game.state.getStageClass("PLACED_BET")).toBe('placed-bet');
		expect(game.state.getStageClass("HIT")).toBe("hit");
		expect(game.state.getStageClass("STAND")).toBe("stand");
		expect(game.state.getStageClass("DEAL")).toBe("deal");
	});

	it("test game stage class", function() {
		game.state.setStageClass("new-game");
		expect(game.state.stage.hasClass("new-game")).toBe(true);
		game.state.setStageClass("new-game-with-history");
		expect(game.state.stage.hasClass("new-game-with-history")).toBe(true);
		game.state.setStageClass("placed-bet");
		expect(game.state.stage.hasClass("placed-bet")).toBe(true);
		expect(game.state.stage.hasClass("new-game-with-history")).toBe(false);
		game.state.setStageClass("hit");
		expect(game.state.stage.hasClass("hit")).toBe(true);
		expect(game.state.stage.hasClass("new-game-with-history")).toBe(false);
		game.state.setStageClass("stand");
		expect(game.state.stage.hasClass("stand")).toBe(true);
		expect(game.state.stage.hasClass("new-game-with-history")).toBe(false);
	});
});