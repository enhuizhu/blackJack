/**
* all the function related to card will be here
**/
game.cards={
   /**
   * varibale to trace user card number
   **/
   playerCards: [],
   
   bankerCards: [],

   animationDelay: 500,

   flipDelay: 500,
   
   generateCard: function(n, cardValue, who) {
	   this.generateCardDom(n, who, jQuery(".gameStage"), cardValue);
       
       var domAtt = who == "player" ? "playerCardNumber" : "computerCardNumber",
       	   addedClass = who == "player" ? "userFirtCard" : "computerCard",
       	   cardDom = jQuery("[data-"+domAtt+"="+n+"]"),
       	   position = this.getUserCardPosition(n, who),
       	   deferred = Q.defer(),
       	   that = this;
       
       setTimeout(function(){
	     cardDom.addClass(addedClass).css({"left":position.x+"px","top":position.y+"px"});
		 /**
		 * add animation end event to the card dom
		 **/
         cardDom.bind(transitionEnd,function(){
	     	 // deferred.resolve("generateUserCard");
		     if (!_.isEmpty(cardValue)) {
			     jQuery(this).addClass("hover");

			     setTimeout(function() {
			     	deferred.resolve("generateCard");
			     },that.flipDelay);

			     setTimeout(function() {
			     	cardDom.find(".front").hide();
			     }, that.flipDelay / 2);
		     }else{
		     	deferred.resolve("generateCard");
		     }
		 });
	   },100);

	   return deferred.promise;
   },
   /**
   * generate card for user
   **/
   generateUserCard:function(n, cardValue){
       return this.generateCard(n, cardValue, "player");
   },

    /**
   * function to generate computer card
   **/
   generateComputerCard:function(n, cardValue){
       return this.generateCard(n, cardValue, "computer");
   },

   setDomCardsTotalValue: function(value) {
	   /**
	   * display the score for the player's card
	   **/
	   jQuery(".score.bottom label").html(value);
   },

   setBankerDomTotalValue: function(value) {
	   /**
	   * display the score for the player's card
	   **/
	   jQuery(".score.top label").html(value);
   }, 
   /**
	* function to get user card position
	**/
	getUserCardPosition:function(n,who){
	   var firstCardPositionX=453,	
		   firstCardPositionY=who=="player"?380:143,
	       distanceBetweenCards=who=="player"?42:30,
	       posX=firstCardPositionX+(n-1)*distanceBetweenCards;
	  
	  return {x:posX,y:firstCardPositionY}; 
	},   

   /**
   * function to generate card dom
   **/
   generateCardDom:function(n,who,parentDom,cardValue){
      if(who=="player"){
	     var attr='data-playerCardNumber="'+n+'"';
	  }else{
	     var attr='data-computerCardNumber="'+n+'"';
	  }
      
      var cardDom='<div class="flip-container cardInStock" '+attr+'>'+
	   '<div class="flipper">'+
		'<div class="front">'+
		'</div>'+
		'<div class="back '+cardValue+'">'+
		'</div>'+
	  '</div>'+
      '</div>';
      
      parentDom.append(cardDom);
    },
	
	/**
	* function to make user card disappear
	**/
	makeUserCardsDisappear: function(who) {
	    /**
		* should get all the user card dom
		**/
		var selector=who=="player"?"[data-playerCardNumber]":"[data-computerCardNumber]",
			userCards = jQuery(selector),
		 	timeDistance=500,
		 	promises = [];
		
		for(var i=0;i<userCards.length;i++){
		    var cardDom=jQuery(userCards.get(i));
		    promises.push(this.removeSinglCardDom(cardDom,i));	
		}

		return Q.all(promises);
	},

	sendoutPlayerCards: function(cards) {
		var startIndex = this.playerCards.length + 1;
		return this.sendOutCards(startIndex, cards, "player");
	},
	
	sendoutBankerCards: function(cards) {
		var startIndex = this.bankerCards.length + 1;
		return this.sendOutCards(startIndex, cards, "computer");
	},

	sendOutCards: function(startIndex, cards, who) {
		var func = who == "player" ? "generateUserCard" : "generateComputerCard",
			promises = [];

		for (var i = 0; i < cards.length; i++) {
			promises.push(registerTimeout(this[func], (this.animationDelay + this.flipDelay) * i, [startIndex + i, cards[i]], this));
		};

		return Q.all(promises);
	},

	addCards: function(cards, who) {
		var newCards = cards.filter(function(v, k) {
			return !_.isEmpty(v);
		});

		if (who == "player") {
			this.playerCards = this.playerCards.concat(newCards);
		}else{
			this.bankerCards = this.bankerCards.concat(newCards);
		}
	},

	deleteAllCards: function() {
		this.bankerCards = [];
		this.playerCards = [];

		game.cards.setDomCardsTotalValue(0);
	},

	removeSinglCardDom:function(cardDom,n){
	    var timeDistance = 100,
	    	deferred = Q.defer();

	    setTimeout(function(){
			cardDom.addClass("disapppear");

			cardDom.bind(transitionEnd,function(){
			   jQuery(this).remove();
			   deferred.resolve();
			});
		}, timeDistance*n);

		return deferred.promise;
	}      
}

