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

	getTranslate: function(scaleRate, winW, winH) {
		var winRatio = winW / winH,
			stageRaio = this.getStageRatio(),
			translateX = 0,
			translateY = 0;
 		/**
		* no need scale
		**/
		if (winW > this.stageWidth && winH > this.stageHeight) {
			return false;
		};

		if (winRatio > stageRaio) {
			/**
			* only translate x
			**/
			translateX = this.stageWidth * (1 - scaleRate) / 2;
		}else {
			translateY = this.stageHeight * (1 - scaleRate) / 2;
		}

		return {
			translateX: translateX,
			translateY: translateY		
		}
	},

	setSize: function() {
		var winW = jQuery(window).width(),
			winH = jQuery(window).height(),
			scaleRate = this.getScaleRate(winW, winH),
			translateObj = this.getTranslate(scaleRate, winW, winH),
			prefixs = ["", "-webkit-","-ms-","-o-","-moz-"],
			cssObj = {},
			scaleStr = "scale(" + scaleRate + ")",
			translateStr = "translate(" + translateObj.translateX + "px," + translateObj.translateY + "px)";

		prefixs.map(function(v, k) {
			var key = v + "transform",
				transformOrigin = v + "transform-origin";
			cssObj[key] = scaleStr + " " + translateStr;
			cssObj[transformOrigin] = "left top";
		});

		console.info("the value of cssObj is:", cssObj);

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