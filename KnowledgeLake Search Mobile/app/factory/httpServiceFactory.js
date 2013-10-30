define(["logger",
		"services/jqHttpService"],
	function (logger, jqHttpService) {
		
		if (window.kendo.version) {
			return jqHttpService;
        }
		/*else if (window.WinJS) {
		
        }*/
		else {
			throw "could not find a valid IHttpService";
        }		
    });