define(['knockout',
        'jquery', 
        'services/iconConverter',
		'framework/logLevel'],
    function (ko, $, IconConverter, logLevel) {
		var getClasses = function (level) {
				var classes = {
					'red': true,
					'orange': true,
					'green': true,
					'black': false //not used currently
	            };
				
				if (level !== logLevel.Fatal && level !== logLevel.Error)
					classes.red = false;
				if (level !== logLevel.Warn) 
					classes.orange = false;
				if (level !== logLevel.Debug && level !== logLevel.Verbose)
					classes.green = false;
				
				return classes;
	        },
			setElementCss = function (element, level) {
				var classes = getClasses(level);
				
				for (var prop in classes) {
					if (classes[prop]) {
						$(element).addClass(prop);
                    }
					else {
						$(element).removeClass(prop);
                    }
                }
            };
		
        ko.bindingHandlers.logLevelToCss = {
            init: function(element, valueAccessor) {
				setElementCss(element, ko.unwrap(valueAccessor()));
            },
            update: function(element, valueAccessor) {
				setElementCss(element, ko.unwrap(valueAccessor()));
            }
        };
});