/**
* all socket functions are here
**/
game.socket = {
	/**
	* functino to connect to node server
	**/	
	connect: function() {
		console.info("-- connecting socket server --");
		this.socket = io.connect(socketUrl);
	},

	on: function(eventName, callBack) {
		this.socket.on(eventName, callBack);
	},

	newGame: function() {
		this.socket.emit("new.game");
	},

	placedChip: function() {
		this.socket.emit("game.chip.put");
	},

	deal: function(chipArr) {
		this.socket.emit("game.deal", chipArr);
	}
};
