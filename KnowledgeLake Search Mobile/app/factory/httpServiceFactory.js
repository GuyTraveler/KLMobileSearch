define(["logger",
		"services/jqHttpService",
		"services/jqHttpService"],
	function (logger, jqHttpService, jqHttpService) {
		if (window.WinJS) {
			throw "WinJS http service not implemented"; //TODO
        }
		else {
			return jqHttpService;
        }		
    });