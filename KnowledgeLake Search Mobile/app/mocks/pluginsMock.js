define(["logger"], function (logger) {
	var plugins = {
		SoftKeyBoard: {
			show: function () {
				logger.logDebug("SoftKeyBoard.show called");
            },
			hide: function () {
				logger.logDebug("SoftKeyBoard.hide called");
            }
        }	
    };
	
	window.plugins = plugins;
});