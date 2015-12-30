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
				bankerCards: socket.bankerCards
			}
		);
	});
});