define([], function () {
	var logLevel = {
		Verbose: 0,
		Debug: 1, 
		Warn: 2,
		Error: 3,
		Fatal: 4		
	};
	
	logLevel.toLevelString = function (levelValue) {
		for (var prop in logLevel) {
			if (logLevel[prop] === levelValue) {
				return prop;
            }
        }
		
		return "Verbose";
    }
	
	return logLevel;
});