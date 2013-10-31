define(["logger",
		"services/jqHttpService"],
	function (logger, jqHttpService) {
		
		if (window.WinJS) {
			throw "WinJS http service not implemented"; //TODO
        }
		else {
			return jqHttpService;
        }		
    });