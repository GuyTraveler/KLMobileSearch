define(["mocks/emailComposerMock",
		"logger",
		"config"],
	function (emailComposerMock, logger, config) {
		if (config.isQunit) {
			logger.logVerbose("Setting MOCK emailComposer to window.plugins");
			
			if (!window.plugins)
				window.plugins = {};					
			if (!window.plugins.emailComposer)
				window.plugins.emailComposer = emailComposerMock;
        }
		
		return window.plugins ? window.plugins.emailComposer : null;
    });