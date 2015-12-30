/**
* game notifications are here
**/
game.notification = {
	pub: function(eventName, params){
		jQuery(document).trigger(eventName, [params]);
	},

	sub: function(eventName, callback){
		jQuery(document).on(eventName, callback);
	}
}