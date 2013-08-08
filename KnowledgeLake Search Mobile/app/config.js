define(["paths.app", "paths.test", "framework/logLevel"], function(appPaths, testPaths, logLevel) {
	
    var isUnitTesting = true,
	    loggingLevel = logLevel.verbose,		
		overwritePaths = function(firstPriority, secondPriority) {
			var prop,
                newDest = {};
            for (prop in firstPriority) {
                newDest[prop] = firstPriority[prop];
            }
            for (prop in secondPriority) {
                if (!(newDest[prop])) {
                    newDest[prop] = secondPriority[prop];
                }
            }
            return newDest;
	    };
	
	var config = {           
	   baseUrl: 'app/',
	   paths: appPaths,  //default to normal application paths
	   /******custom configuration*******/
	   /*       config: {
	       i18n: {
	           locale: 'es'
	       }  
	   },*/
	   shim: {
	       jquery: {
	           exports: 'jquery'
	       },
	       knockout: {
	           exports: 'ko'  
	       },
	       kendo: {
	           deps: ['jquery'],
	           exports: 'kendo'               
	       }
	   },	   
	   logLevel: loggingLevel,
	   isQunit: isUnitTesting
	};
		
	if (isUnitTesting) {
		config.paths = overwritePaths(testPaths, config.paths);
    }
	
	return config;
});