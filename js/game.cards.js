/**
* all the function related to card will be here
**/
game.cards={
   /**
   * varibale to trace user card number
   **/
   userCardNumber:0,
   
   /**
   * generate card for user
   **/
   generateUserCard:function(n){
       this.generateCardDom(n,"player",jQuery(".gameStage"));     
       var cardDom = jQuery("[data-playerCardNumber="+n+"]");
       var position = this.getUserCardPosition(n,"player");
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
      var firstCardPositionX=453;	
	  var firstCardPositionY=who=="player"?274:38;
      var distanceBetweenCards=who=="player"?42:30; 
      var posX=firstCardPositionX+(n-1)*distanceBetweenCards;
	  return {x:posX,y:firstCardPositionY}; 
   },   
  
   /**
   * function to generate computer card
   **/
   generateComputerCard:function(n){
       this.generateCardDom(n,"computer",jQuery(".gameStage"));     
       var cardDom = jQuery("[data-computerCardNumber="+n+"]");
       var position = this.getUserCardPosition(n,"computer");
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
   generateCardDom:function(n,who,parentDom){
      if(who=="player"){
	     var attr='data-playerCardNumber="'+n+'"';
	  }else{
	     var attr='data-computerCardNumber="'+n+'"';
	  }
      var cardDom='<div class="flip-container cardInStock" '+attr+'>'+
	   '<div class="flipper">'+
		'<div class="front">'+
		'</div>'+
		'<div class="back bh1">'+
		'</div>'+
	  '</div>'+
      '</div>';
      parentDom.append(cardDom);
    },
	
	/**
	* function to make user card disappear
	**/
	makeUserCardsDisappear:function(who){
	    /**
		* should get all the user card dom
		**/
		var selector=who=="player"?"[data-playerCardNumber]":"[data-computerCardNumber]"
		var userCards = jQuery(selector);
		var timeDistance=500;
		for(var i=0;i<userCards.length;i++){
		    var cardDom=jQuery(userCards.get(i));
		    this.removeSinglCardDom(cardDom,i);	
		}
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

