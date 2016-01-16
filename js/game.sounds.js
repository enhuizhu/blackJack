"use strict";

game.sounds = {
	list: {

	},

	init: function() {
		this.addSound("sendcard", "./sounds/cardPlace.wav");
		this.addSound("cardFlip", "./sounds/cardSlide.wav");
		this.addSound("btnClick", "./sounds/btnClick.mp3");
		this.addSound("chipSelect", "./sounds/chipSelect.mp3");
		this.addSound("landBoard", "./sounds/landBoard.mp3");
		this.addSound("chipStack", "./sounds/chipStack.mp3");
		this.addSound("lost", "./sounds/lost.mp3");
		this.addSound("win", "./sounds/win.mp3");
		this.addSound("draw", "./sounds/draw.mp3");
		this.addSound("chipsHandle", "./sounds/chipsHandle.wav");
	},

	addSound: function(name, path) {
		/**
		* already exist, should change the src with the new path
		**/
		if (this.list[name]) {
			this.list[name].src = path;
			return false;
		};

		this.list[name] = new Audio();
		this.list[name].src = path;
	},

	playTempAudio: function(path) {
		var tempAudio = new Audio();
	 	tempAudio.src = path;
	 	tempAudio.play();
	 	
	 	tempAudio.addEventListener("ended", function() {
	 		console.info("Audio end");
	 		tempAudio = null;
	 	});
	},

	play: function(name) {
		if (this.list[name].duration > 0 && !this.list[name].paused) {
			this.playTempAudio(this.list[name].src);
			return false;
		};

		this.list[name].play();
	},

	stop: function(name) {
		this.list[name].pause();
		this.list[name].currentTime = 0;
	},

	playFinalStateSound: function(finalState) {
		switch(finalState) {
			case 0:
				this.play("lost");
				break;
			case 1:
				this.play("draw");
				break;
			case 2:
				this.play("win");
				break;
		}
	},
};