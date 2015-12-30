/**
* all functions that related to game state will be here
**/
game.state = {
	currentState: null,

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
	},

	deal: function() {
		if (game.state.currentState != game.state.list.PLACED_BET) {
			throw "expect state:" + game.state.list.PLACED_BET + ", actual state is:" + game.state.currentState;
		};

		if (_.isEmpty(game.chip.chipArr)) {
			throw "chips can not be empty!";
		};

		game.socket.deal(game.chip.chipArr);
	},

	newGame: function() {
		if (game.state.currentState != game.state.list.NEW) {
			throw "expect state is:" + game.state.list.NEW + ", currentState is:" + game.state.currentState;
		};

		game.socket.newGame();
	},

	undo: function() {
		/**
		* should check if the current state is placed bet and thie chip arr is empty or not
		**/
		if (game.state.currentState != game.state.list.PLACED_BET) {
			throw "expect state is:" + game.state.list.PLACED_BET + ", currentState is:" + game.state.currentState;
		};

		if (_.isEmpty(game.chip.chipArr)) {
			return false;
		};

		game.chip.chipArr.pop();
		
		jQuery(".flyChip:last-child").remove();

		if (_.isEmpty(game.chip.chipArr)) {
			game.socket.newGame();
		};
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
			};
		});
	},

	onDeal: function(data) {
		console.info("on deal!", data);
		var playerCards = data.playerCards,
			bankerCards = data.bankerCards;

		game.cards.sendoutPlayerCards(playerCards);

		setTimeout(function() {
			game.cards.sendoutBankerCards(bankerCards);
		}, game.cards.animationDelay * playerCards.length);
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
