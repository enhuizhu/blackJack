/**
* all function related to chip will come here
**/
game.chip={
   topChipHeightDis:8,

   currentChip: null,

   chipArr: [],

   bankerChipArr: [],

   chipAnimationTime: 1000,
   
   /**
   * all the initialation is here
   **/
   init: function () {
   		this.bindEvents();
   },

   bindEvents: function() {
   		jQuery(".chipIcon").bind("click", this.selectChip);
   		jQuery("#chipPlacedArea").bind("click", this.placeChip);
   },

   placeChip: function() {
   		/**
   		* should check if the current state is waiting for place bet
   		**/
   		if (game.state.currentState != game.state.list.WAITING_FOR_BET 
   			&& game.state.currentState != game.state.list.PLACED_BET) {
   				console.error("currentState is:", game.state.currentState);
   				return false;
   		};

   		if (_.isEmpty(game.chip.currentChip)) {
   			throw "current chip is emtpy!";
   		};

   		game.chip.chipArr.push(game.chip.currentChip);
   		game.chip.putRegularChip(game.chip.chipArr.length, game.chip.currentChip, "top").then(function() { 
             game.chip.displayChipScore();
             game.chip.setChipTotalInDom();
         });
   		/**
   		* should send this infomation to node server
   		**/
   		game.socket.placedChip();
   },

   displayChipScore: function() {
	   /**
	   * should check if it already show, if not just add class show
	   **/
	   if (!jQuery(".chip").hasClass("show")) {
	   	jQuery(".chip").addClass("show");
	   };
   },

   setChipTotalInDom: function() {
	   jQuery(".chip label").html(game.chip.getChipTotal());
   },

   hideChipScore: function() {
   	   jQuery(".score.chip").removeClass("show");
   },

   isChipDomOnTable: function() {
   	   return jQuery(".flyChip").length > 0;
   },

   removeDuplicateChipDom: function(chipArr) {
   	   var that = this;
   	   
   	   _.each(chipArr, function(v, k) {
   	   	   var chipClass = that.getChipDomClass(v),
   	   	   	   allChips = jQuery("." + chipClass);
   	   	   
   	   	   jQuery(allChips.get(allChips.length - 1)).remove();
   	   });
   },
   /**
   * function to get the total value of chips
   **/
   getChipTotal: function() {
		var sum = 0;

		if (!_.isEmpty(this.bankerChipArr)) {
			sum = _.reduce(this.bankerChipArr, function(memo, num) {
				return memo + parseInt(num);
			}, sum);
		};

		return _.reduce(this.chipArr, function(memo, num) {
			return memo + parseInt(num);
		}, sum);
   },

   selectChip: function(){
		console.info("selectChip");
      game.sounds.play("chipSelect");
		/**
		* make other chip inactive
		**/
		jQuery(".chipIcon").removeClass("active");
		jQuery(this).addClass("active");

		var chipValue = jQuery(this).attr("data-chip");
		game.chip.currentChip = chipValue;
   },

   resetChipState: function() {
   	   this.emtpyChipArr();
   	   this.emptyBankerChipArr();
   },

   emtpyChipArr: function() {
   	   this.removeDuplicateChipDom(this.chipArr);
   	   this.chipArr = [];
   },
   
   emptyBankerChipArr: function() {
   	   this.removeDuplicateChipDom(this.bankerChipArr);
   	   this.bankerChipArr = [];
   },

   resetChips: function(finalState)	{
   	  	switch(finalState) {
   	  		case 0: //user lose, should let banker get all the chips
   	  			/**
   	  			* should hide the chip score
   	  			**/
   	  			this.hideChipScore();
   	  			return this.makeChipDisppear("top", "banker");
   	  			break;
   	  		case 1: // user and banker draw, should keep chips there
   	  			break;
   	  		case 2: // user win, banker should put more chip there
   	  			this.bankerChipArr = _.clone(this.chipArr);
   	  			this.setChipTotalInDom();
   	  			
   	  			return this.bankerPutChips(this.chipArr, this.chipArr.length + 1);
   	  			break;
   	  	}
   },
   /**
   * function to put regular chip on the table
   **/
   putRegularChip:function(chipIndex,chipValue,position,from){ 
		game.sounds.play("chipSelect");

      var chipClass=this.getChipDomClass(chipValue),
			  deferred = Q.defer();

		var domId = this.generateFlyingChipDom(chipClass);

		if (position == "top" && from == "banker") {
			var extraClass = "flyingFromBanker";
		}else{
			var extraClass = position == "top" ? "flying" : "flyingBottom";
		}

		var finalClass = position == "top" ? "topEndPos" : "topEndBottom";

		jQuery("#" + domId).addClass(extraClass);
		/**
		* add transition end event to the fly chip
		**/
		jQuery("#" + domId).bind(animationEnd,function(){
			 console.info("chip down");
         if (game.chip.chipArr.length <= 1) {
             game.sounds.play("landBoard");
         }else{
             game.sounds.play("chipStack");
         }

         deferred.resolve();
			jQuery(this).removeClass(extraClass).addClass(finalClass);
			/**
			* according to its index value should chnage its y position
			**/
			var top = jQuery(this).css("top");
			topInt=eval(top.substr(0,top.length-2));
			topInt=topInt - (chipIndex-1)*game.chip.topChipHeightDis;
			top=topInt+"px";
			jQuery(this).css({"top":top});
			jQuery(this).removeAttr("id");
		});

		return deferred.promise;
   },

   putChips: function(chips, who, startIndex) {
	    var timeDistance = 100,
	   	  that = this,
	   	  promises = [];
	   	   // startIndex = this.chipArr.length + 1;

	    _.each(chips, function(v, k){
   	   	var promise = registerTimeout(that.putRegularChip, timeDistance * k, [startIndex + k, v, "top", who], that);
   	   	promises.push(promise);
	    });

	   return Q.all(promises);
	},
   
   bankerPutChips: function(chips, startIndex) {
   	   return this.putChips(chips, "banker", startIndex);
   },

   playerPutChips: function(chips, startIndex) {
   	   return this.putChips(chips, "player", startIndex);
   },
   /**
   * function to make chip disappear
   **/
   makeChipDisppear:function(position, who){
      game.sounds.play("chipsHandle");
      
      var selector = position == "top" ? ".topEndPos" : ".topEndBottom",
      	  animationClass = who == "banker" ? "chipDisappearForBanker" : "chipDisappear",
      	  deferred = Q.defer();
	  
      if(jQuery(selector).length) {
		  jQuery(selector).addClass(animationClass);
	  
		  jQuery(selector).bind(transitionEnd,function(){
		    jQuery(this).remove();
		    deferred.resolve();
		  });
      }else{
      	  deferred.resolve();
      }

	  return deferred.promise;
   },
   
   /**
   * remove chips directly from table
   **/
   removeChipFromTable: function() {
   	   jQuery(".topEndPos, .topEndBottom").remove();
   },
   /**
   * funciton to generate the dom of flying dom
   **/
   generateFlyingChipDom:function(chipClass){
       var id = _.uniqueId("fly_");
       var domContent='<div class="chipIcon '+chipClass+' flyChip" id="'+id+'"></div>';
	   jQuery(".gameStage").append(domContent);

	   return id;
   },

   /**
   * according to chip value return the dom class for the chip
   **/
   getChipDomClass:function(chipValue){
      switch(parseInt(chipValue)){
	      case 5:
		     return "betChipFive";
			 break;
		  case 10:
		     return "betChipTen";
			 break;
		  case 25:
		     return "betChipTwentyFive";
			 break;
		  case 50:
		     return "betChipFifty";
			 break;
		  case 100:
		     return "betChipHundread";
			 break;
	 }
	 alert("invalid chip value");
	 return false;
   }
}