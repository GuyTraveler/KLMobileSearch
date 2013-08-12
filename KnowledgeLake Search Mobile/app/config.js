define(["framework/logLevel"], function(logLevel) {
	
    var isUnitTesting = true,
	    loggingLevel = logLevel.Verbose;
	
	var config = {           
	   baseUrl: 'app/',
	   paths: {
		   //lib
	       jquery: 'lib/jquery',
	       kendoMain: 'lib/kendo.mobile.min',
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
	       kendoMain: {
	           deps: ['jquery'],
	           exports: 'kendoMain'               
	       }
	   },
	   map: {              
		   '*': {
			   'kendo': 'factory/kendoFactory',
			   'FileManagement': 'factory/fileManagementFactory',		   
			   'system': 'framework/system',
			   'extensions': 'framework/extensions',
			   //service locations
			   'IAuthenticationService': 'services/sharepoint/authenticationService',
			   'IWebsService': 'services/sharepoint/websService',
			   'ISiteDataService': 'services/sharepoint/siteDataService',
			   'ISiteDataCachingService': 'services/siteDataCachingService',
			   'INtlmLogonService': 'services/ntlmLogonService',
			   'IClaimsLogonService': 'services/claimsLogonService'
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
	
	return config;
});