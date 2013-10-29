define(["kendoMain", 
		"mocks/kendoMock",
		"logger",
		"config"],
	function (kendoMain, kendoMock, logger, config) {
		if (config.isQunit) {
			if (!window.App)
				logger.logVerbose("Setting MOCK kendo application to window.App");
			
			window.App = window.App || new kendoMock.mobile.mockApp();
			
			return kendoMock;
        }
		else {
			return kendoMain;
        }
    });