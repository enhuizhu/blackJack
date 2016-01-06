"use strict";

game.stageScale = {
	stageWidth: 1200,
	stageHeight: 800,

	getStageRatio: function() {
		return this.stageWidth / this.stageHeight;
	},

	getScaleRate: function(winW, winH) {
		var winRatio = winW / winH,
			stageRaio = this.getStageRatio(),
			scaleRate = null;
		/**
		* no need to scale.
		*/
		if (winW > this.stageWidth && winH > this.stageHeight) {
			return 1;
		};

		if (winRatio > stageRaio) {
			/**
			* width is greater then height, should scale base on height
			*/
			scaleRate = winH / this.stageHeight;
		}else{
			/**
			* height is greater the width, should scale base on width
			**/
			scaleRate = winW / this.stageWidth;
		}

		return scaleRate;
	},

	setSize: function() {
		var scaleRate = this.getScaleRate(jQuery(window).width(), jQuery(window).height()),
			prefixs = ["", "-webkit-","-ms-","-o-","-moz-"],
			cssObj = {},
			scaleStr = "scale(" + scaleRate + ")";

		prefixs.map(function(v, k) {
			var key = v + "transform",
				transformOrigin = v + "transform-origin";
			cssObj[key] = scaleStr;
			cssObj[transformOrigin] = "left top";
		});

		jQuery("#gameStage").css(cssObj);
	},

	bindEvents: function() {
		var that = this;
		
		jQuery(window).resize(function() {
			that.setSize();
		});
	}
}


jQuery(document).ready(function() {
	game.stageScale.setSize();
	game.stageScale.bindEvents();
});