function transitionEndEventName (isAni) {
        var i,
        undefined,
        el = document.createElement('div');
        if(isAni){
		  var transitions = {
            'animation':'animationend',
            'OAnimation':'oanimationend',  // oTransitionEnd in very old Opera
            'MozAnimation':'animationend',
            'WebkitAnimation':'webkitAnimationEnd'
          };
		}else{
		  var transitions = {
            'transition':'transitionend',
            'OTransition':'otransitionend',  // oTransitionEnd in very old Opera
            'MozTransition':'transitionend',
            'WebkitTransition':'webkitTransitionEnd'
         };
		}

        for (i in transitions) {
          if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
            return transitions[i];
          }
         }
        //TODO: throw 'TransitionEnd event is not supported in this browser'; 
       }
var transitionEnd=transitionEndEventName();
var animationEnd=transitionEndEventName(true);


/**
* all the global varibles will be defined here
**/
var game={

}

