define(["system"], function (system) {
	var plugins = {
		SoftKeyBoard: {
			show: function () {
				system.logDebug("SoftKeyBoard.show called");
            }
        }	
    };
	
	window.plugins = plugins;
});