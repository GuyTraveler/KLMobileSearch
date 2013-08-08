define(["kendoMain", 
		"mocks/kendoMock",
		"config"],
	function (kendoMain, kendoMock, config) {
		if (config.isQunit) {
			if (!window.App)
				console.log("Setting MOCK kendo application to window.App");
			
			window.App = window.App || new kendoMock.mobile.mockApp();
			
			return kendoMock;
        }
		else {
			return kendoMain;
        }
    });