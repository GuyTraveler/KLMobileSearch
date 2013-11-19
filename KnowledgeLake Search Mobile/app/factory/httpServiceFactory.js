define(["logger",
		"services/jqHttpService",
		"services/winjsHttpService"],
	function (logger, jqHttpService, winjsHttpService) {
		if (window.WinJS) {
		    return winjsHttpService;
        }
		else {
			return jqHttpService;
        }		
    });