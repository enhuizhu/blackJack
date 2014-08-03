/**
* all function related to chip will come here
**/
game.chip={
   topChipHeightDis:8,
   
   /**
   * function to put regular chip on the table
   **/
   putRegularChip:function(chipIndex,chipValue){ 
      
	  var chipClass=this.getChipDomClass(chipValue);
	  this.generateFlyingChipDom(chipClass);
      
	  jQuery("#flyChip").addClass("flying");
	  /**
	  * add transition end event to the fly chip
	  **/
	  jQuery("#flyChip").bind(animationEnd,function(){
	      jQuery(this).removeClass("flying").addClass("topEndPos");
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
   },
   
   /**
   * funciton to generate the dom of flying dom
   **/
   generateFlyingChipDom:function(chipClass){
       var domContent='<div class="chipIcon '+chipClass+' flyChip" id="flyChip"></div>';
	   jQuery(".gameStage").append(domContent);
   },

   /**
   * according to chip value return the dom class for the chip
   **/
   getChipDomClass:function(chipValue){
      switch(chipValue){
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
