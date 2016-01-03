"use strict";

function registerTimeout(callBack, timeDelay, paramList, bindObj) {
	var deferred = Q.defer();
	
	setTimeout(function(){
		if (_.isUndefined(bindObj)) {
			bindObj = {};
		};
		
		var promise = callBack.apply(bindObj, paramList);
		
		promise.then(function(data) {
			deferred.resolve("registerTimeout");
		});

	}, timeDelay);

	return deferred.promise;
}