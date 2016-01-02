var port = 8080,
 	io = require("socket.io").listen(port),
 	_ = require("underscore"),
 	cardObj = require("./modules/cards.js"),
 	state = {
 		NEW: "NEW",
 		NEW_WITH_HISTORY: "NEW_WITH_HISTORY",
 		WAITING_FOR_BET: "WAITING_FOR_BET",
 		PLACED_BET: "PLACED_BET",
 		DEAL: "DEAL",
 		HIT: "HIT",
 		STAND: "STAND"
 	};

io.sockets.on("connection", function(socket) {
	console.info("new client connected!");
	/**
	* it's new connection, should send state "NEW" to client
	**/
	socket.currentState = state.NEW;
	socket.emit("state.change", state.NEW);

	socket.on("disconnect", function() {
		console.info("client disconnect");
	});

	socket.on("new.game", function(data) {
		console.info("new game request");
		socket.currentState = state.WAITING_FOR_BET;
		socket.emit("state.change", socket.currentState);
	});

	socket.on("game.chip.put", function(data) {
		console.info("chip put")
		socket.currentState = state.PLACED_BET;
		socket.emit("state.change", socket.currentState);
	});

	socket.on("game.deal", function(data) {
		console.info("game deal", data);
		socket.currentState = state.DEAL;
		socket.cardObj = new cardObj();
		socket.playerCards = socket.cardObj.sendOutCards(2),
		socket.bankerCards = socket.cardObj.sendOutCards(2),
		
		socket.emit("state.change", 
			{
				currentState: socket.currentState,
				playerCards: socket.playerCards,
				bankerCards: [socket.bankerCards[0],""],
				playerTotal: socket.cardObj.getCardsTotalValue(socket.playerCards),
			}
		);
	});

	socket.on("game.stand", function(data) {
		console.info("game stand", data);
		socket.currentState = state.STAND;
		
		var resetCards = socket.cardObj.getRestBankerCards(socket.playerCards, socket.bankerCards);
		
		socket.bankerCards = socket.bankerCards.concat(resetCards);
		
		var finalState = socket.cardObj.getPlayerFinalState(socket.playerCards, socket.bankerCards);

		socket.emit("state.change",
			{
				currentState: socket.currentState,
				secondBankerCard: socket.bankerCards[1],
				playerTotal: socket.cardObj.getCardsTotalValue(socket.playerCards),
				bankerTotal: socket.cardObj.getCardsTotalValue(socket.bankerCards),
				resetCards: resetCards,
				finalState: finalState, //0 means player lose, 1 means draw, 2 means win
			}
		);
	});

});