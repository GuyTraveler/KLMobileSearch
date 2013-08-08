define(["map", "map.test", "framework/logLevel"], function(map, testMap, logLevel) {
	
    var isUnitTesting = true,
	    loggingLevel = logLevel.verbose;
	
	var config = {           
	   baseUrl: 'app/',
	   paths: {            
		   //lib
	       jquery: 'lib/jquery',
	       kendo: 'lib/kendo.mobile.min',
	       knockout: 'lib/knockout',	       
	       ntlm: 'lib/ntlm',
	       i18n: 'lib/i18n'		   
       },
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
	   /******custom configuration*******/
	   /*       config: {
	       i18n: {
	           locale: 'es'
	       }  
	   },*/
	   isQunit: isUnitTesting
	};
		
	if (isUnitTesting) {
		config.map = testMap;
    }
	else {
		config.map = map;
    }
	
	return config;
});