define(["framework/logLevel"], function(logLevel) {
	
    var isUnitTesting = false,
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
               //factory
			   'kendo': 'factory/kendoFactory',
			   'FileManagement': 'factory/fileManagementFactory',		   
               
               //framework
			   'system': 'framework/system',
			   'extensions': 'framework/extensions',
			   
               //service locations               
               //sharepoint wrappers
			   'IAuthenticationService': 'services/sharepoint/authenticationService',
			   'IWebsService': 'services/sharepoint/websService',
			   'ISiteDataService': 'services/sharepoint/siteDataService',
               'ISearchService': 'services/sharepoint/searchService',
               
               //ours
			   'ISiteDataCachingService': 'services/siteDataCachingService',
               'IQueryService': 'services/soapQueryService',               
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
