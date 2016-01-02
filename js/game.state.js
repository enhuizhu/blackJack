/**
* all functions that related to game state will be here
**/
game.state = {
	currentState: null,

	flipAnimationTime: 600,

	list: {
 		NEW: "NEW",
 		NEW_WITH_HISTORY: "NEW_WITH_HISTORY",
 		WAITING_FOR_BET: "WAITING_FOR_BET",
 		PLACED_BET: "PLACED_BET",
 		DEAL: "DEAL",
 		HIT: "HIT",
 		STAND: "STAND"
 	},

 	classLists: {
 		NEW: "new-game",
 		NEW_WITH_HISTORY: "new-game-with-history",
 		WAITING_FOR_BET: "waiting-for-bet",
 		PLACED_BET: "placed-bet",
 		DEAL: "deal",
 		HIT: "hit",
 		STAND: "stand",
 	},

 	resultStateClassLists: {
 		DRAW: "draw",
 		WIN: "win",
 		LOSE: "lose",
 	},
 	resultStatesClasses: ["draw", "win",  "lose"],

	init: function() {
		this.stage = jQuery("#gameStage");
		game.socket.connect();
		this.bindEvents();
	},

	bindEvents: function() {
		this.bindControlBtnsEvents();		
		this.initSocketEvents();
	},

	bindControlBtnsEvents: function() {
		jQuery(".newGame").bind("click", this.newGame);
		jQuery(".undo").bind("click", this.undo);
		jQuery(".deal").bind("click", this.deal);
		jQuery(".stand").bind("click", this.stand);
	},

	checkError:function(expectState) {
		if (game.state.currentState != game.state.list[expectState]) {
			throw "expect state:" + game.state.list[expectState] + ", actual state is:" + game.state.currentState;
		};
	},

	deal: function() {
		game.state.checkError(game.state.list.PLACED_BET);

		if (_.isEmpty(game.chip.chipArr)) {
			throw "chips can not be empty!";
		};

		game.socket.deal(game.chip.chipArr);
	},

	newGame: function() {
		game.state.checkError(game.state.list.NEW);
		game.socket.newGame();
	},

	undo: function() {
		/**
		* should check if the current state is placed bet and thie chip arr is empty or not
		**/
		game.state.checkError(game.state.list.PLACED_BET);

		if (_.isEmpty(game.chip.chipArr)) {
			return false;
		};

		game.chip.chipArr.pop();
		
		jQuery(".flyChip:last-child").remove();

		if (_.isEmpty(game.chip.chipArr)) {
			game.socket.newGame();
		};
	},

	stand: function() {
		game.state.checkError(game.state.list.DEAL);
		game.socket.stand();		
	},

	initSocketEvents: function() {
		var that = this;
		
		game.socket.on("state.change", function(data) {
			console.info("state change, the value of data is:", data);
			
			if (_.isObject(data)) {
				that.currentState = data.currentState;
			}else{
				that.currentState = data;	
			}

			var currentClass = that.getStageClass(that.currentState);
			that.setStageClass(currentClass);

			if (that.currentState == that.list.DEAL) {
				that.onDeal(data);
			}else if (that.currentState == that.list.STAND) {
				that.onStand(data);
			};
		});
	},

	onDeal: function(data) {
		console.info("on deal!", data);
		var playerCards = data.playerCards,
			bankerCards = data.bankerCards;
	
		game.cards.sendoutPlayerCards(playerCards);

		game.cards.addCards(playerCards, "player");

		setTimeout(function() {
			game.cards.sendoutBankerCards(bankerCards);
			game.cards.addCards(bankerCards, "banker");
		}, game.cards.animationDelay * playerCards.length);

		setTimeout(function() {
			if (!jQuery(".score.bottom").hasClass("show")) {
				jQuery(".score.bottom").addClass("show");
			};
			/**
			* display the score for the player's card
			**/
			jQuery(".score.bottom label").html(data.playerTotal);
		}, game.cards.animationDelay * (playerCards.length + bankerCards.length));
	},

	onStand: function(data) {
		var that = this,
			secondCard = jQuery(jQuery(".computerCard").get(1));
				
		secondCard.find(".back").addClass(data.secondBankerCard);		
		secondCard.addClass("hover");
		
		game.cards.addCards([data.secondBankerCard], "banker");
		/**
		* set result for player
		**/
		this.setResultForPlayer(data.playerTotal, data.finalState);

		setTimeout(function() {
			/**
			* should check if data contains reset cards
			**/
			if (!_.isEmpty(data.resetCards)) {
				game.cards.sendoutBankerCards(data.resetCards);

				setTimeout(function() {
					that.setResultForBanker(data.bankerTotal, data.finalState);
				}, game.cards.animationDelay * data.resetCards.length);
			
			}else{
				that.setResultForBanker(data.bankerTotal, data.finalState);
			}
		}, this.flipAnimationTime);
	},

	setResult: function(total, finalState, who) {
		var domClass = who == "player" ? ".result.bottom" : ".result.top",
		 	resultDom = jQuery(domClass);

		resultClass = this.getResultClass(finalState, who);
		
		resultDom.find("div").html(total);

		if (total > 21) {
			resultDom.find("label").html("BUST");
		}else{
			resultDom.find("label").html(resultClass.toUpperCase());
		}

		resultDom.addClass("show");
		this.setResultDomClass(resultDom, resultClass);
	},

	setResultForPlayer: function(playerTotal, finalState) {
		this.setResult(playerTotal, finalState, "player");
	},

	setResultForBanker: function(bankerTotal, finalState) {
		this.setResult(bankerTotal, finalState, "banker");
	},

	setResultDomClass: function(resultDom, domClass) {
		var removeClassses = "";
		
		_.each(this.resultStatesClasses, function(v,k) {
			removeClassses += "v ";
		});

		removeClassses = jQuery.trim(removeClassses);
		resultDom.removeClass(removeClassses).addClass(domClass);
	},

	getResultClass: function(finalState, who) {
		if (finalState == 1) {
			return this.resultStateClassLists.DRAW;
		};

		if (finalState == 0) {
			return who == "player" ? this.resultStateClassLists.LOSE : this.resultStateClassLists.WIN;
		};

		return who == "player" ? this.resultStateClassLists.WIN : this.resultStateClassLists.LOSE;
	},

	setStageClass: function(className) {
		/**
		* should get all the possible classses and then
		* remove that, after that should add new class to 
		* that
		**/
		var classses = "";
		
		_.each(this.classLists, function(v, k) {
			classses += v + " ";
		});

		classses = jQuery.trim(classses);
		this.stage.removeClass(classses).addClass(className);
	},

	/**
	* get the class in the view
	**/
	getStageClass: function(state) {
		/**
		* should check if state code in the list
		**/
		var codeList = Object.keys(this.list);

		if (codeList.indexOf(state) == -1) {
			throw "invalid state!";
		};

		switch(state) {
			case this.list.NEW:
				return this.classLists.NEW;
			case this.list.NEW_WITH_HISTORY:
				return this.classLists.NEW_WITH_HISTORY;
			case this.list.PLACED_BET:
				return this.classLists.PLACED_BET
			case this.list.HIT:
				return this.classLists.HIT;
			case this.list.STAND:
				return this.classLists.STAND;
			case this.list.WAITING_FOR_BET:
				return this.classLists.WAITING_FOR_BET;
			case this.list.DEAL:
				return this.classLists.DEAL;
		}

		return false;
	}
}


jQuery(document).ready(function() {
	game.state.init();
});
