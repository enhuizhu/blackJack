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
		jQuery(".hit").bind("click", this.hit);
		jQuery(".rebet").bind("click", this.rebet);
		jQuery(".doubleRebet").bind("click", this.doubleRebet);
		jQuery(".clearChip").bind("click", this.clearChip);
	},

	checkError:function(expectState) {
		if (_.isArray(expectState)) {
			if (expectState.indexOf(game.state.currentState) == -1) {
				throw "unexpected state:" + game.state.currentState;
			};

			return true;
		};

		if (game.state.currentState != game.state.list[expectState]) {
			throw "expect state:" + game.state.list[expectState] + ", actual state is:" + game.state.currentState;
		};
	},

	hit: function() {
		game.sounds.play("btnClick");
		game.state.checkError([game.state.list.DEAL, game.state.list.HIT]);
		
		if (game.cards.isCardFlying) {
			return false;
		};
		/**
		* should send request to server for asking new card
		**/
		game.socket.hit();
	},

	rebet: function() {
		game.sounds.play("btnClick");
		game.state.rebetCommonFunction();
	},

	rebetCommonFunction: function(isDouble) {
		game.state.checkError(game.state.list.NEW_WITH_HISTORY);
		/**
		* clear table
		**/
		game.state.clearTable().then(function() {
			/**
			* should check if the chipDom already on the table.
			**/
			if (!game.chip.isChipDomOnTable()) {				
				var chipArr = isDouble ? game.chip.chipArr.concat(game.chip.chipArr) : game.chip.chipArr;

				game.chip.playerPutChips(chipArr, 1).then(function() {
			   		if (isDouble) {
			   			game.chip.chipArr = game.chip.chipArr.concat(game.chip.chipArr);
						game.chip.setChipTotalInDom();
			   		};

			   		game.chip.displayChipScore();
					game.state.deal(true);	
				});
			}else{
				if (game.chip.bankerChipArr.length > 0) {
					game.chip.emptyBankerChipArr();
					game.chip.setChipTotalInDom();
				};

				if (isDouble) {
					game.chip.playerPutChips(game.chip.chipArr, game.chip.chipArr.length + 1).then(function() {
			   			game.chip.chipArr = game.chip.chipArr.concat(game.chip.chipArr);
						game.chip.setChipTotalInDom();
						game.state.deal(true);
					});
				}else{
					game.state.deal(true);
				}
		   		
		   		game.chip.displayChipScore();
			}
		});
	},

	doubleRebet: function() {
		game.sounds.play("btnClick");
		game.state.rebetCommonFunction(true);
	},

	deal: function(nosound) {
		if (!nosound) {
			game.sounds.play("btnClick");
		};

		game.state.checkError([game.state.list.PLACED_BET, game.state.list.NEW_WITH_HISTORY]);

		if (_.isEmpty(game.chip.chipArr)) {
			throw "chips can not be empty!";
		};

		game.socket.deal(game.chip.chipArr);
	},

	newGame: function() {
		game.sounds.play("btnClick");
		game.state.checkError([game.state.list.NEW, game.state.list.NEW_WITH_HISTORY]);
		/**
		* should check current game state, if the state is NEW_WITH_HISTORY, then should
		* clean the table
		**/
		if (game.state.currentState === game.state.list.NEW_WITH_HISTORY) {
			game.state.clearTable(true).then(function() {
				game.chip.resetChipState();
				game.socket.newGame();
			});
		}else{
			game.socket.newGame();
		}
	},

	undo: function() {
		game.sounds.play("btnClick");
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
			game.chip.hideChipScore();
		};
	},

	clearChip: function() {
		game.sounds.play("btnClick");
		game.state.checkError(game.state.list.PLACED_BET);
		game.chip.emtpyChipArr();
		game.socket.newGame();
		game.chip.hideChipScore();
	},

	stand: function() {
		game.sounds.play("btnClick");
		game.state.checkError([game.state.list.DEAL, game.state.list.HIT]);
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

			if (that.currentState === that.list.DEAL) {
				that.onDeal(data);
			}else if (that.currentState === that.list.STAND) {
				that.onStand(data);
			}else if(that.currentState === that.list.HIT){
				that.onHit(data);
			}
		});
	},

	onHit: function(data) {
		console.info("on hit", data);
		/**
		* send out the new card
		**/
		game.cards.isCardFlying = true;
		
		game.cards.sendoutPlayerCards(data.newCard, "player").then(function(params) {
			console.info("on hit promise", params);
			game.cards.setDomCardsTotalValue(data.playerTotal);
			game.cards.addCards(data.newCard, "player");
			game.cards.isCardFlying = false;
			/**
			* should check if user already get black jack or bust
			**/
			if (typeof data.finalState != "undefined") {
				game.socket.stand();
			};
		});
	},

	onDeal: function(data) {
		console.info("on deal!", data);
		var playerCards = data.playerCards,
			bankerCards = data.bankerCards;

		game.cards.isCardFlying = true;
		
		game.cards.sendoutPlayerCards(playerCards).then(function() {
			game.cards.addCards(playerCards, "player");
			
			if (!jQuery(".score.bottom").hasClass("show")) {
				jQuery(".score.bottom").addClass("show");
			};
			/**
			* display the score for the player's card
			**/
			game.cards.setDomCardsTotalValue(data.playerTotal);
			
			game.cards.sendoutBankerCards(bankerCards).then(function() {
				game.cards.addCards(bankerCards, "banker");
				/**
				* should check if it's black jack
				**/
				if (typeof data.finalState != "undefined") {
					game.socket.stand();
				};

				game.cards.isCardFlying = false;
			});
		});
	},

	onStand: function(data) {
		var that = this,
			secondCard = jQuery(jQuery(".computerCard").get(1));
				
		secondCard.find(".back").addClass(data.secondBankerCard);		
		secondCard.addClass("hover");
		console.info("second card hover");
		game.sounds.play("cardFlip");

		setTimeout(function() {
			secondCard.find(".front").hide();
		}, game.cards.flipDelay / 2);
		
		game.cards.addCards([data.secondBankerCard], "banker");

		this.flipBankerSecondCardAndSendoutRestCards(data).then(function() {
			that.setResultForBanker(data.bankerTotal, data.finalState);
			/**
			* set result for player
			**/
			that.setResultForPlayer(data.playerTotal, data.finalState);
			game.chip.resetChips(data.finalState);			
			game.socket.newGameWithHistory();
		})
	},

	onNewWithHistory: function() {

	},

	flipBankerSecondCardAndSendoutRestCards: function(data) {
		 var deferred = Q.defer();
		 
		 setTimeout(function() {
			/**
			* should check if data contains reset cards
			**/
			if (!_.isEmpty(data.resetCards)) {
				game.cards.sendoutBankerCards(data.resetCards).then(function() {
					deferred.resolve();
				});
			}else{
				deferred.resolve();
			}

		}, this.flipAnimationTime);

		return deferred.promise;
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
		game.sounds.playFinalStateSound(finalState);
		this.setResult(playerTotal, finalState, "player");
	},

	setResultForBanker: function(bankerTotal, finalState) {
		this.setResult(bankerTotal, finalState, "banker");
	},

	setResultDomClass: function(resultDom, domClass) {
		var removeClassses = "";
		
		_.each(this.resultStateClassLists, function(v,k) {
			removeClassses += v + " ";
		});

		removeClassses = jQuery.trim(removeClassses);
		resultDom.removeClass(removeClassses).addClass(domClass);
	},

	resetResultDomAndScoreDom: function() {
		jQuery(".result, .score").removeClass("show");
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
	},

	clearTable: function(isNewGame) {
		var deferred = Q.defer(),
			that = this;
		
		game.cards.makeUserCardsDisappear("banker").then(function() {
			game.cards.makeUserCardsDisappear("player").then(function() {
				game.cards.deleteAllCards();
				
				if (isNewGame && game.chip.isChipDomOnTable()) {
					game.chip.makeChipDisppear("top").then(function() {
						deferred.resolve();
						that.resetResultDomAndScoreDom();
					});
				}else {
					if (isNewGame) {
						game.chip.removeChipFromTable();
					};

					deferred.resolve();
					that.resetResultDomAndScoreDom();
				}
			});
		});

		return deferred.promise;
	}
}