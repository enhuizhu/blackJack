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
   /**
   * generate card for user
   **/
   generateUserCard:function(n, cardValue){
       console.info("n, cardValue", n, cardValue);
       this.generateCardDom(n,"player",jQuery(".gameStage"), cardValue);
       
       var cardDom = jQuery("[data-playerCardNumber="+n+"]"),
       	   position = this.getUserCardPosition(n,"player");
       
       setTimeout(function(){
	     cardDom.addClass("userFirtCard").css({"left":position.x+"px","top":position.y+"px"});
		 /**
		 * add animation end event to the card dom
		 **/
         cardDom.bind(transitionEnd,function(){
		     jQuery(this).addClass("hover");
		 });
	   },100);
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
   * function to generate computer card
   **/
   generateComputerCard:function(n, cardValue){
       this.generateCardDom(n,"computer",jQuery(".gameStage"), cardValue);

       var cardDom = jQuery("[data-computerCardNumber="+n+"]"),
           position = this.getUserCardPosition(n,"computer");
       
       setTimeout(function(){
	     cardDom.addClass("computerCard").css({"left":position.x+"px","top":position.y+"px"});
		 /**
		 * add animation end event to the card dom
		 **/
         cardDom.bind(transitionEnd,function(){
		     jQuery(this).addClass("hover");
		 });
	   },100);
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
		 	timeDistance=500;
		
		for(var i=0;i<userCards.length;i++){
		    var cardDom=jQuery(userCards.get(i));
		    this.removeSinglCardDom(cardDom,i);	
		}
	},

	sendoutPlayerCards: function(cards) {
		var startIndex = this.playerCards.length + 1;
		this.sendOutCards(startIndex, cards, "player");
	},
	
	sendoutBankerCards: function(cards) {
		var startIndex = this.bankerCards.length + 1;
		this.sendOutCards(startIndex, cards, "computer");
	},

	sendOutCards: function(startIndex, cards, who) {
		var that = this,
			func = who == "player" ? "generateUserCard" : "generateComputerCard";

		for (var i = 0; i < cards.length; i++) {
			this.registerTimeout(that[func], this.animationDelay * i, [startIndex + i, cards[i]]);
		};
	},

	registerTimeout: function(callBack, timeDelay, paramList) {
		var that = this;
		
		setTimeout(function(){
			callBack.apply(that, paramList);
		}, timeDelay);
	},
	 
	removeSinglCardDom:function(cardDom,n){
	    var timeDistance = 100;
	    setTimeout(function(){
	      cardDom.addClass("disapppear");
		    cardDom.bind(transitionEnd,function(){
			   jQuery(this).remove();
		  });
		},timeDistance*n);
	}      
}

