
function transitionEndEventName (isAni) {
    var i, el = document.createElement('div');
    
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
}
