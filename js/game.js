var transitionEnd=transitionEndEventName();
var animationEnd=transitionEndEventName(true);

/**
* all the global varibles will be defined here
**/
var game={
	init: function() {
		game.chip.init();
		game.state.init();
		game.sounds.init();
		game.stageScale.setSize();
		game.stageScale.bindEvents();
	}
}

jQuery(document).ready(function() {
	game.init();
});

